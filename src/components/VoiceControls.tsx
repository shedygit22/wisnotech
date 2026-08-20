import { Mic, PhoneCall, Square, Volume2 } from "lucide-react";
import { stopSpeaking, type UseVoice, type UseVoiceConversation } from "../lib/useVoice";

interface MicProps {
  voice: UseVoice;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

/** Mic button — toggle speech-to-text capture. */
export function MicButton({ voice, onTranscript, disabled }: MicProps) {
  if (!voice.supported) return null;
  if (voice.listening) {
    return (
      <button
        type="button"
        aria-label="Stop listening"
        title="Stop listening"
        onClick={voice.stopListening}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/60 bg-red-500/20 text-red-300 transition-colors animate-pulse"
      >
        <Square className="h-4 w-4 fill-current" aria-hidden />
      </button>
    );
  }
  return (
    <button
      type="button"
      aria-label="Speak your message"
      title="Speak your message"
      onClick={() => voice.startListening(onTranscript)}
      disabled={disabled}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-200 hover:border-neon/40 hover:text-neon disabled:opacity-40"
    >
      <Mic className="h-4 w-4" aria-hidden />
    </button>
  );
}

interface SpeakProps {
  onSpeak: () => void;
}

/** Read-aloud toggle on a single assistant bubble. */
export function SpeakButton({ onSpeak }: SpeakProps) {
  return (
    <button
      type="button"
      aria-label="Read aloud"
      title="Read aloud"
      onClick={onSpeak}
      className="mt-2 inline-flex items-center gap-1 text-[12px] text-white/45 transition-colors hover:text-neon"
    >
      <Volume2 className="h-3.5 w-3.5" aria-hidden />
      Listen
    </button>
  );
}

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

/** Auto-read-replies switcher shown in the chat header. */
export function AutoSpeakToggle({ enabled, onToggle }: ToggleProps) {
  if (!("speechSynthesis" in window)) return null;
  return (
    <button
      type="button"
      onClick={() => {
        stopSpeaking();
        onToggle();
      }}
      aria-pressed={enabled}
      title={enabled ? "Disable spoken replies" : "Enable spoken replies"}
      className={`ml-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
        enabled
          ? "border-neon/50 bg-neon/10 text-neon"
          : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
      }`}
    >
      <Volume2 className="h-3.5 w-3.5" aria-hidden />
      {enabled ? "Voice on" : "Voice off"}
    </button>
  );
}

interface ConversationProps {
  voice: UseVoiceConversation;
  /** Optional override so callers can warm up Piper before starting. */
  onStart?: () => void;
}

const CONV_LABEL: Record<string, string> = {
  off: "Voice conversation",
  listening: "Listening… speak now",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

/** Turn on the hands-free speak → reply → speak loop (Gemini TTS voice). */
export function VoiceCallButton({ voice, onStart }: ConversationProps) {
  if (!voice.supported) return null;

  if (voice.active) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-neon/40 bg-neon/10 px-3 py-2">
        <span className="relative flex h-2.5 w-2.5">
          {voice.status === "listening" && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
          )}
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
        </span>
        <span className="text-xs font-medium text-neon">{CONV_LABEL[voice.status]}</span>
        <button
          type="button"
          onClick={voice.stop}
          aria-label="End voice conversation"
          title="End voice conversation"
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (onStart ? onStart() : voice.start())}
      aria-label="Start voice conversation"
      title="Start a hands-free voice conversation (natural Gemini TTS voice)"
      className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60 transition-all duration-200 hover:border-neon/40 hover:text-neon"
    >
      <PhoneCall className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden />
      Talk
    </button>
  );
}