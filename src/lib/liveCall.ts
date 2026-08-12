export type LiveStatus = "off" | "connecting" | "listening" | "thinking" | "speaking";

export interface LiveCallHandlers {
  onStatus?: (status: LiveStatus) => void;
  onUserTranscript?: (text: string) => void;
  onAssistantTranscript?: (text: string) => void;
  onEnergy?: (level: number) => void;
  /** Fired when Wisne hands the caller a booking link. */
  onBookingLink?: (url: string) => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface LiveCallController {
  stop: () => void;
  sendText: (text: string) => void;
  /** Real-time Web Audio taps: mic input and AI (playback) output. */
  analysers?: {
    mic: AnalyserNode;
    output: AnalyserNode;
  };
}

const WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";
const MODEL = "gemini-3.1-flash-live-preview";
const VOICE = "Kore";

/** Calendly scheduling link Wisne hands out when a caller wants to book a call. */
const BOOKING_URL = "https://calendly.com/shedyhillzton77/30min";
const BOOKING_TOOL_NAME = "get_booking_link";

function tokenEndpoint(): string {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_LOCAL_FUNCTIONS) {
    return "http://localhost:8787/live-token";
  }
  return "/api/live-token";
}

function base64Encode(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function base64Decode(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Sequential, gapless PCM (16-bit LE) playback over one AudioContext. */
class PcmPlayer {
  private ctx: AudioContext;
  private sources: AudioBufferSourceNode[] = [];
  private nextStart = 0;
  /** Taps the AI's live audio so the visualization can move in sync with speech. */
  readonly analyser: AnalyserNode;

  constructor(ctx: AudioContext, startDelay = 0.06) {
    this.ctx = ctx;
    this.nextStart = ctx.currentTime + startDelay;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.connect(ctx.destination);
  }

  enqueue(pcm: Uint8Array, rate: number): void {
    const n = Math.floor(pcm.byteLength / 2);
    if (n === 0) return;
    const view = new DataView(pcm.buffer, pcm.byteOffset, pcm.byteLength);
    const float = new Float32Array(n);
    for (let i = 0; i < n; i++) float[i] = view.getInt16(i * 2, true) / 32768;

    const buf = this.ctx.createBuffer(1, n, rate);
    buf.getChannelData(0).set(float);

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    // Route through the analyser so the orb can hear what the AI is saying.
    src.connect(this.analyser);
    const when = Math.max(this.ctx.currentTime + 0.01, this.nextStart);
    src.start(when);
    this.nextStart = when + buf.duration;
    this.sources.push(src);
    src.onended = () => {
      const i = this.sources.indexOf(src);
      if (i >= 0) this.sources.splice(i, 1);
    };
  }

  stop(): void {
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
      s.disconnect();
    }
    this.sources = [];
    this.nextStart = 0;
  }
}

const WORKLET_CODE = `
// Linear resampler that always outputs exactly 16000 Hz 16-bit PCM,
// regardless of the browser's actual AudioContext sampleRate (48k/44.1k/…).
class Resampler {
  constructor() {
    this.ratio = sampleRate / 16000;
    this.index = 0; // fractional position of the next output sample
  }
  process(input) {
    const out = [];
    const n = input.length;
    while (this.index < n) {
      const i0 = Math.floor(this.index);
      const i1 = Math.min(i0 + 1, n - 1);
      const frac = this.index - i0;
      out.push(input[i0] + (input[i1] - input[i0]) * frac);
      this.index += this.ratio;
    }
    this.index -= n;
    return out;
  }
}

class PcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.resampler = new Resampler();
    this.acc = []; // accumulates 16k samples until we have a ~40ms chunk
  }
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      let ch = input[0];
      if (input.length > 1) {
        const mono = new Float32Array(ch.length);
        for (let c = 0; c < input.length; c++) {
          for (let i = 0; i < mono.length; i++) mono[i] += input[c][i] / input.length;
        }
        ch = mono;
      }
      const resampled = this.resampler.process(ch);
      for (let i = 0; i < resampled.length; i++) this.acc.push(resampled[i]);
      if (this.acc.length >= 640) {
        const int16 = new Int16Array(this.acc.length);
        for (let i = 0; i < int16.length; i++) {
          const s = this.acc[i];
          int16[i] = s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff);
        }
        this.port.postMessage(int16.buffer, [int16.buffer]);
        this.acc = [];
      }
    }
    return true;
  }
}
registerProcessor('wisne-pcm', PcmProcessor);
`;

export async function startLiveCall(
  handlers: LiveCallHandlers = {},
  systemInstruction?: string,
  greeting?: string
): Promise<LiveCallController> {
  const fire = <K extends keyof LiveCallHandlers>(k: K, ...args: Parameters<NonNullable<LiveCallHandlers[K]>>) => {
    (handlers[k] as ((...a: unknown[]) => void) | undefined)?.(...args);
  };

  // 1. Mint a one-use ephemeral token server-side.
  let token: string;
  try {
    const res = await fetch(tokenEndpoint(), { method: "POST" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Live auth failed (${res.status}): ${body.slice(0, 160)}`);
    }
    const json = await res.json();
    token = json?.token;
    if (!token) throw new Error("Live auth returned no token");
  } catch (err) {
    fire("onError", err instanceof Error ? err.message : "Live auth failed");
    throw err;
  }

  // 2. Open the bidirectional stream.
  const ws = new WebSocket(`${WS_BASE}?access_token=${encodeURIComponent(token)}`);
  const ready = new Promise<void>((resolve, reject) => {
    ws.onopen = () => resolve();
    ws.onerror = () => reject(new Error("Live connection failed (check network)"));
  });
  try {
    await ready;
  } catch (err) {
    fire("onError", err instanceof Error ? err.message : "Live connection failed");
    throw err;
  }

  // 3. Configure the session.
  const setup = {
    setup: {
      model: `models/${MODEL}`,
      generationConfig: {
        responseModalities: ["AUDIO"],
        temperature: 0.9,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
        },
      },
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      tools: [
        {
          functionDeclarations: [
            {
              name: BOOKING_TOOL_NAME,
              description:
                "Provides the Calendly booking link so the caller can schedule a call with Wisnotech. Call this whenever the caller asks to book, schedule, or set up a call, or when they ask for the booking/scheduling link.",
              parameters: { type: "OBJECT", properties: {} },
            },
          ],
        },
      ],
      realtimeInputConfig: {
        automaticActivityDetection: { disabled: false, prefixPaddingMs: 500 },
        activityHandling: "START_OF_ACTIVITY_INTERRUPTS",
        turnCoverage: "TURN_INCLUDES_ONLY_ACTIVITY",
      },
    },
  };
  ws.send(JSON.stringify(setup));

  // 4. Mic capture streaming in PCM 16k chunks.
  let audioStream: MediaStream | null = null;
  let audioCtx: AudioContext | null = null;
  let workletNode: AudioWorkletNode | null = null;
  let micGain: GainNode | null = null;
  let micAnalyser: AnalyserNode | null = null;

  const startMic = async (): Promise<AudioContext> => {
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    let ctx: AudioContext;
    try {
      ctx = new AC({ sampleRate: 16000 });
    } catch {
      ctx = new AC();
    }
    audioCtx = ctx;
    await ctx.audioWorklet.addModule(
      URL.createObjectURL(new Blob([WORKLET_CODE], { type: "application/javascript" }))
    );
    const source = ctx.createMediaStreamSource(audioStream);
    workletNode = new AudioWorkletNode(ctx, "wisne-pcm");
    source.connect(workletNode);

    // Tap the raw mic signal so the orb can react to the user's voice.
    micAnalyser = ctx.createAnalyser();
    micAnalyser.fftSize = 512;
    micAnalyser.smoothingTimeConstant = 0.35;
    source.connect(micAnalyser);

    workletNode.port.onmessage = (ev: MessageEvent<ArrayBuffer>) => {
      const all = new Float32Array(new Int16Array(ev.data));
      fire("onEnergy", micLevel(all));
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            realtimeInput: {
              audio: { mimeType: "audio/pcm;rate=16000", data: base64Encode(new Uint8Array(ev.data)) },
            },
          })
        );
      }
    };
    // Keep MIC silent in the local mix.
    micGain = ctx.createGain();
    micGain.gain.value = 0;
    micGain.connect(ctx.destination);
    workletNode.connect(micGain);
    return ctx;
  };

  const fireDone = () => {
    fire("onEnd");
    fire("onStatus", "off");
  };

  let ctx: AudioContext;
  try {
    ctx = await startMic();
    fire("onStatus", "listening");
  } catch (err) {
    ws.close();
    fire("onError", err instanceof Error ? err.message : "Microphone unavailable");
    fireDone();
    throw err;
  }

  // 5. Playback + status driven by server messages.
  const player = new PcmPlayer(ctx);
  let receivedAudio = false;
  let greetingSent = false;
  let bookingShown = false;

  ws.onmessage = async (ev: MessageEvent) => {
    const raw =
      typeof ev.data === "string"
        ? ev.data
        : ev.data instanceof Blob
          ? await ev.data.text()
          : new TextDecoder().decode(ev.data);
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    // Make Wisne open the call with a spoken greeting.
    if ((msg as { setupComplete?: unknown }).setupComplete !== undefined) {
      if (greeting && !greetingSent) {
        greetingSent = true;
        ws.send(
          JSON.stringify({
            clientContent: {
              turns: [
                { role: "user", parts: [{ text: `(Opening the call now — say this greeting out loud and then wait: "${greeting}")` }] },
              ],
              turnComplete: true,
            },
          })
        );
      }
    }

    const sc = (msg.serverContent ?? {}) as Record<string, unknown>;

    // Handle the model asking for the booking link. Tool calls can arrive at
    // the top level OR embedded inside serverContent.modelTurn.parts.
    const topCalls = ((msg.toolCall ?? {}) as { functionCalls?: { id?: string; name?: string }[] }).functionCalls ?? [];
    const modelTurn = sc.modelTurn as
      | { parts?: { toolCall?: { functionCalls?: { id?: string; name?: string }[] }; inlineData?: { data?: string; mimeType?: string }; text?: string }[] }
      | undefined;
    const partCalls = (modelTurn?.parts ?? []).flatMap(
      (p) => (p.toolCall as { functionCalls?: { id?: string; name?: string }[] } | undefined)?.functionCalls ?? []
    );

    const calls = [...topCalls, ...partCalls].filter((c) => c?.name === BOOKING_TOOL_NAME);
    if (calls.length > 0) {
      const responses = calls.map((c) => ({
        id: c.id ?? "",
        name: c.name ?? "",
        response: JSON.stringify({ bookingUrl: BOOKING_URL }),
      }));
      ws.send(JSON.stringify({ toolResponse: { functionResponses: responses } }));
      bookingShown = true;
      fire("onBookingLink", BOOKING_URL);
    }

    if (sc.inputTranscription) {
      const t = (sc.inputTranscription as { text?: string }).text ?? "";
      if (t) fire("onUserTranscript", t);
    }
    if (sc.outputTranscription) {
      const t = (sc.outputTranscription as { text?: string }).text ?? "";
      if (t) fire("onAssistantTranscript", t);
    }

    let assistantSpoke = "";
    for (const part of modelTurn?.parts ?? []) {
      if (part.inlineData?.data) {
        const pcm = base64Decode(part.inlineData.data);
        const mime = part.inlineData.mimeType ?? "";
        const rate = Number(/rate=(\d+)/.exec(mime)?.[1]) || 24000;
        player.enqueue(pcm, rate);
        if (!receivedAudio) {
          receivedAudio = true;
          fire("onStatus", "speaking");
        }
      } else if (part.text) {
        fire("onAssistantTranscript", part.text);
        assistantSpoke += ` ${part.text}`;
      }
    }

    // Fallback: if the model offered to book/schedule a call without invoking
    // the tool, surface the booking card anyway so the link is never missed.
    if (calls.length === 0 && !bookingShown && /(book|schedul|calendly|booking|set up a call|link).{0,60}(call|slot|time)/i.test(assistantSpoke)) {
      bookingShown = true;
      fire("onBookingLink", BOOKING_URL);
    }

    if (sc.interrupted || sc.turnComplete) {
      if (receivedAudio) {
        receivedAudio = false;
        fire("onStatus", "listening");
      }
    }
  };

  ws.onclose = () => {
    player.stop();
    stopMic();
    fireDone();
  };

  const stopMic = async () => {
    workletNode?.port.close();
    workletNode?.disconnect();
    micAnalyser?.disconnect();
    micGain?.disconnect();
    audioStream?.getTracks().forEach((t) => t.stop());
    await audioCtx?.close().catch(() => undefined);
    workletNode = null;
    micAnalyser = null;
    micGain = null;
    audioStream = null;
    audioCtx = null;
  };

  let stopped = false;
  return {
    stop: async () => {
      if (stopped) return;
      stopped = true;
      ws.close();
      player.stop();
      await stopMic();
      fireDone();
    },
    sendText: (text: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ realtimeInput: { text } }));
      }
    },
    analysers: {
      mic: micAnalyser ?? ctx.createAnalyser(),
      output: player.analyser,
    },
  };
}

function micLevel(pcm: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) sum += pcm[i] * pcm[i];
  return Math.min(1, Math.sqrt(sum / Math.max(1, pcm.length)) * 6);
}