import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send,
  Sparkles,
  RefreshCw,
  Bot,
  ArrowUpRight,
  Zap,
  Trash2,
} from "lucide-react";
import { askServerWithFallbackStream } from "../lib/api";
import {
  createInitialState,
  detectBusinessType,
  detectProjectType,
  detectRole,
  type ClientProfile,
} from "../lib/assistant";
import { useChatSessions } from "../lib/chatStore";
import { speakText, splitSentences, useVoice, useVoiceConversation } from "../lib/useVoice";
import { useAutoSpeech } from "../lib/useAutoSpeech";
import { MicButton, SpeakButton, AutoSpeakToggle, VoiceCallButton } from "./VoiceControls";
import { VoiceCallOverlay } from "./LiveVoiceCall";

const STARTERS = [
  "I'm a business owner — where do I start?",
  "How much do AI videos cost?",
  "Build me a website + automation",
  "I want to learn AI hands-on",
  "Give me an AI quote",
  "Show me your AI creations",
];

const WELCOME =
  "Hey there! I'm Wisne — the Wisnotech AI assistant. Ask me anything about our services, pricing, videos, or what to build first. I can even draft a plan for you.";

/** Calendly link Wisne shares when a visitor wants to book a call. */
const BOOKING_URL = "https://calendly.com/shedyhillzton77/30min";

export default function LlmStudio() {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lastReply, setLastReply] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string>("");
  const profileRef = useRef<ClientProfile>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voice = useVoice();
  const { enabled: autoSpeak, enabledRef: autoSpeakRef, toggle: toggleAutoSpeak } = useAutoSpeech();

  /* Multi-session chat with persisted history (localStorage). */
  const chat = useChatSessions({
    welcome: () => [{ role: "assistant", text: WELCOME }],
  });
  const messages = chat.messages;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, streamingText]);

  const ask = useCallback(
    async (raw: string, onSentence?: (sentence: string) => void): Promise<string | null> => {
      const question = raw.trim();
      if (!question || thinking) return null;
      chat.add({ role: "user", text: question });
      setInput("");
      setThinking(true);
      const history = chat.messages
        .map((m) => ({ role: m.role, content: m.text }))
        .concat([{ role: "user", content: question }]);

      // Accumulate a client profile from what the visitor tells us so the
      // LLM backend can tailor its answers to their business and project.
      const biz = detectBusinessType(question);
      if (biz) profileRef.current.businessType = biz;
      const proj = detectProjectType(question);
      if (proj) profileRef.current.projectType = proj;
      const role = detectRole(question);
      if (role && !profileRef.current.role) profileRef.current.role = role;

      // Stream the reply so it types out live, Gemini-style.
      let sentenceBuffer = "";
      const reply = await askServerWithFallbackStream(
        question,
        createInitialState(),
        history.slice(0, -1),
        profileRef.current,
        (chunk) => {
          setStreamingText((prev) => prev + chunk);
          setThinking(false);
          if (onSentence) {
            sentenceBuffer += chunk;
            const { complete, remainder } = splitSentences(sentenceBuffer);
            sentenceBuffer = remainder;
            for (const s of complete) onSentence(s);
          }
        }
      );
      if (onSentence) {
        const tail = sentenceBuffer.trim();
        if (tail) onSentence(tail);
      }
      chat.add({ role: "assistant", text: reply.text });
      setLastReply(reply.text);
      setStreamingText("");
      setThinking(false);
      return reply.text;
    },
    [thinking, chat]
  );

  const send = useCallback(
    async (raw: string) => {
      const reply = await ask(raw);
      if (reply && autoSpeakRef.current) void speakText(reply);
    },
    [ask, autoSpeakRef]
  );

  /* Hands-free voice conversation: listen → ask → speak reply → repeat.
     Speech-to-text uses the browser mic; replies are spoken with the hosted
     Gemini TTS voice. */
  const voiceConversation = useVoiceConversation(ask);

  const startVoiceConversation = useCallback(() => {
    voiceConversation.start();
  }, [voiceConversation]);

  const handleTranscript = useCallback(
    (t: string) => {
      setInput(t);
      send(t);
    },
    [send]
  );

  const reset = () => {
    chat.newChat();
    setInput("");
  };

  return (
    <>
      <section id="assistant" className="section">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="eyebrow">AI Studio</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Chat with <span className="text-neon">Wisne</span>, your AI advisor
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Ask anything about Wisnotech — services, pricing, videos, or what to build first.
            Get instant, tailored answers. The floating assistant stays active too.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Left rail: suggestions */}
          <div className="space-y-6">
            <div className="card space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Zap className="h-4 w-4 text-neon" aria-hidden />
                Try one of these
              </div>
              <div className="flex flex-col gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/70 transition-all hover:border-neon/40 hover:bg-white/[0.06] hover:text-white"
                  >
                    {s}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-neon" aria-hidden />
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Bot className="h-4 w-4 text-neon" aria-hidden />
                What Wisne knows
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                  All six Wisnotech services and what fits you
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                  Pricing, timelines and AI video showreels
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                  Real plans for automation and growth
                </li>
              </ul>
            </div>

            {/* Chat history */}
            <div className="card">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <RefreshCw className="h-4 w-4 text-neon" aria-hidden />
                Recent conversations
              </div>
              <div className="mt-4 flex max-h-[260px] flex-col gap-1.5 overflow-y-auto pr-1">
                {chat.sessions.length === 0 && (
                  <p className="text-sm text-white/40">Nothing here yet — start a chat below.</p>
                )}
                {chat.sessions.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => chat.open(s.id)}
                    className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                      s.id === chat.activeId
                        ? "border-neon/40 bg-neon/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-white/80">{s.title}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Delete conversation"
                      onClick={(e) => {
                        e.stopPropagation();
                        chat.deleteChat(s.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          chat.deleteChat(s.id);
                        }
                      }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat console */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0f]/70 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Wisne — AI Studio</p>
                <p className="text-xs text-white/50">Connected to a live AI model</p>
              </div>
              <AutoSpeakToggle enabled={autoSpeak} onToggle={toggleAutoSpeak} />
              <button
                type="button"
                onClick={reset}
                className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                New chat
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-[460px] overflow-y-auto px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed sm:max-w-[75%] ${
                        m.role === "user"
                          ? "rounded-br-md bg-white text-[#080808]"
                          : "rounded-bl-md border border-white/10 bg-white/[0.05] text-white/85"
                      }`}
                    >
                      {m.text}
                      {m.role === "assistant" && (
                        <SpeakButton onSpeak={() => speakText(m.text)} />
                      )}
                    </div>
                  </div>
                ))}
                {thinking && !streamingText && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                          className="h-1.5 w-1.5 rounded-full bg-neon"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {streamingText && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-[14.5px] leading-relaxed text-white/85 sm:max-w-[75%]">
                      {streamingText}
                      <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-neon align-middle" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 px-4 py-4 sm:px-6"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, pricing, or a plan for your business…"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
              />
              <MicButton voice={voice} onTranscript={handleTranscript} disabled={thinking} />
              <VoiceCallButton voice={voiceConversation} onStart={startVoiceConversation} />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neon text-[#080808] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

      {/* In-browser voice call overlay (Piper TTS) */}
      <AnimatePresence>
        {voiceConversation.active && voiceConversation.status !== "off" && (
          <VoiceCallOverlay
            status={voiceConversation.status}
            transcript={lastReply ?? undefined}
            bookingLink={BOOKING_URL}
            onStop={voiceConversation.stop}
          />
        )}
      </AnimatePresence>
    </>
  );
}