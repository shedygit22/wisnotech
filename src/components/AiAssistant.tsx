import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X, ArrowUpRight, History as HistoryIcon, Plus, Trash2, MessageSquareText } from "lucide-react";
import { askServerWithFallbackStream } from "../lib/api";
import { sendLead } from "../lib/leadSink";
import { speakText, splitSentences, stopSpeaking, useVoice, useVoiceConversation } from "../lib/useVoice";
import { useAutoSpeech } from "../lib/useAutoSpeech";
import { useChatSessions } from "../lib/chatStore";
import { MicButton, SpeakButton, AutoSpeakToggle, VoiceCallButton } from "./VoiceControls";
import { VoiceCallOverlay } from "./LiveVoiceCall";
import { track } from "../lib/analytics";
import {
  buildClientProfile,
  createInitialState,
  contextMessage,
  openingLine,
  exitIntentMessage,
  quickReplies,
  type AssistState,
} from "../lib/assistant";

/** Calendly link Wisne shares when a visitor wants to book a call. */
const BOOKING_URL = "https://calendly.com/shedyhillzton77/30min";

const SECTION_IDS = [
  { id: "home", label: "home" },
  { id: "services", label: "services" },
  { id: "showreel", label: "showreel" },
  { id: "creations", label: "creations" },
  { id: "testimonials", label: "testimonials" },
  { id: "about", label: "about" },
  { id: "solutions", label: "solutions" },
  { id: "process", label: "process" },
  { id: "academy", label: "academy" },
  { id: "assistant", label: "assistant" },
  { id: "contact", label: "contact" },
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [state, setState] = useState<AssistState>(() => createInitialState());
  const stateRef = useRef(state);
  stateRef.current = state;
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [attention, setAttention] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastReply, setLastReply] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const promptedRef = useRef(false);
  const voice = useVoice();
  const { enabled: autoSpeak, enabledRef: autoSpeakRef, toggle: toggleAutoSpeak } = useAutoSpeech();

  /* Multi-session chat with persisted history (localStorage). */
  const chat = useChatSessions({
    welcome: () => [{ role: "assistant", text: openingLine(stateRef.current) }],
  });
  const messages = chat.messages;

  /* User sensing — scroll spy (what the visitor is looking at) */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let found: string | null = null;
        for (const s of SECTION_IDS) {
          const el = document.getElementById(s.id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= window.innerHeight * 0.6 && r.bottom >= 0) {
            found = s.label;
          }
        }
        setCurrentSection((prev) => (prev === found ? prev : found));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Proactive: when user lands and lingers a few seconds, pulse the button */
  useEffect(() => {
    if (open) return;
    const t1 = setTimeout(() => setAttention(true), 4000);
    const t2 = setTimeout(() => setAttention(false), 9000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  /* Exit intent — mouse leaving the viewport top */
  useEffect(() => {
    if (promptedRef.current) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 8 && !open) {
        promptedRef.current = true;
        setState((s) => ({
          ...s,
          stage: s.stage === "intro" ? "need" : s.stage,
        }));
        chat.add({ role: "assistant", text: exitIntentMessage(state.name) });
        setOpen(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [open, state.name]);

  /* Context tap — if user is deep in a section and hasn't chatted, invite them */
  useEffect(() => {
    if (open || promptedRef.current) return;
    const msg = contextMessage(currentSection);
    if (!msg) return;
    const t = setTimeout(() => {
      if (!open && !promptedRef.current) {
        // Attach the section context to the opening greeting
        chat.commit(chat.messages.length > 0 ? chat.messages : [{ role: "assistant", text: msg }]);
        setAttention(true);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [currentSection, open, chat.messages.length]);

  const openChat = useCallback(() => {
    setOpen(true);
    setAttention(false);
    setShowHistory(false);
    if (chat.messages.length === 0) {
      chat.commit([{ role: "assistant", text: openingLine(state) }]);
    }
  }, [chat, state]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, streamingText]);

  const ask = useCallback(
    async (raw: string, onSentence?: (sentence: string) => void): Promise<string | null> => {
      const question = raw.trim();
      if (!question || thinking) return null;
      track("chat_sent", { source: onSentence ? "voice" : "text", len: question.length });
      chat.add({ role: "user", text: question });
      setInput("");
      setThinking(true);

      // Build the conversation history sent to the LLM backend.
      const history = chat.messages
        .map((m) => ({ role: m.role, content: m.text }))
        .concat([{ role: "user" as const, content: question }]);

      // Stream the reply so it types out live, Gemini-style. The first chunk
      // switches the typing dots to the growing message and re-enables input.
      // In voice mode we also hand each complete sentence to `onSentence` so
      // TTS can start speaking it immediately while the reply keeps streaming.
      let sentenceBuffer = "";
      const reply = await askServerWithFallbackStream(
        question,
        stateRef.current,
        history.slice(0, -1),
        buildClientProfile(stateRef.current),
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
      chat.add({ role: "assistant", text: reply.text, href: reply.href });
      setLastReply(reply.text);
      setStreamingText("");
      setThinking(false);

      // Capture a qualified lead the moment an email appears in the chat.
      const emailMatch = question.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
      if (emailMatch) {
        void sendLead({
          name: stateRef.current.name,
          email: emailMatch[0],
          interest: stateRef.current.interest,
          timeline: stateRef.current.timeline,
          budget: stateRef.current.budget,
          source: "ai-assistant",
        });
      }
      return reply.text;
    },
    [thinking, chat, stateRef]
  );

  const submit = useCallback(
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
    setOpen(true);
    track("voice_start", { surface: "assistant" });
    voiceConversation.start();
  }, [voiceConversation]);

  /* Esc closes chat */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        stopSpeaking();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Stop speech when the chat closes */
  useEffect(() => {
    if (!open) stopSpeaking();
  }, [open]);

  const handleTranscript = useCallback(
    (t: string) => {
      setInput(t);
      submit(t);
    },
    [submit]
  );

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label="Open Wisne AI assistant"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-neon/50 bg-[#0b1324]/90 text-white shadow-[0_0_30px_-6px_rgba(80,140,255,0.7)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-[#0e1a33]/95"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <Sparkles className="h-6 w-6 text-neon" aria-hidden />
        )}
        <AnimatePresence>
          {attention && !open && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-40 flex w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0f]/95 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
            role="dialog"
            aria-label="Wisnotech AI sales assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Wisne — your AI advisor</p>
                <p className="text-xs text-white/50">
                  {state.name ? `Helping ${state.name}, ` : ""}guides you to the right fit
                </p>
              </div>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 text-[11px] font-medium text-neon">
                <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                Live
              </span>
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                aria-label="Chat history"
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  showHistory
                    ? "border-neon/40 bg-neon/15 text-neon"
                    : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                <HistoryIcon className="h-3.5 w-3.5" aria-hidden />
                History
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHistory(false);
                  chat.newChat();
                }}
                aria-label="New conversation"
                title="New conversation"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
              <AutoSpeakToggle enabled={autoSpeak} onToggle={toggleAutoSpeak} />
            </div>

            {/* Messages or history */}
            {showHistory ? (
              <div className="flex h-[380px] flex-col px-3 py-4">
                <div className="mb-2 flex items-center justify-between px-2">
                  <p className="text-sm font-semibold text-white/90">Chat history</p>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/50">
                    {chat.sessions.length} {chat.sessions.length === 1 ? "conversation" : "conversations"}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                {chat.sessions.length === 0 && (
                  <p className="px-2 py-6 text-center text-sm text-white/40">No conversations yet.</p>
                )}
                {chat.sessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      chat.open(s.id);
                      setShowHistory(false);
                    }}
                    className={`group mb-1.5 flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                      s.id === chat.activeId
                        ? "border-neon/40 bg-neon/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <MessageSquareText className="h-4 w-4 shrink-0 text-neon" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-white/90">{s.title}</span>
                      <span className="block text-[11px] text-white/40">
                        {new Date(s.updatedAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
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
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </button>
                ))}
                </div>
              </div>
            ) : (
              <>
            {/* Messages */}
            <div ref={scrollRef} className="flex h-[380px] flex-col gap-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-white text-[#080808]"
                        : "rounded-bl-md border border-white/10 bg-white/[0.05] text-white/85 backdrop-blur-sm"
                    }`}
                  >
                    {m.text}
                    {m.href && (
                      <a
                        href={m.href}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-neon hover:underline"
                      >
                        Jump to that section
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
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
                  <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-[14px] leading-relaxed text-white/85">
                    {streamingText}
                    <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-neon align-middle" />
                  </div>
                </div>
              )}
            </div>
              </>
            )}

            {/* Quick replies adapt to stage */}
            <div className="flex gap-2 overflow-x-auto border-t border-white/[0.08] px-4 py-3 [scrollbar-width:none]">
              {quickReplies(state.stage).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-neon/40 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={state.stage === "close" ? "Drop your email to get a plan…" : "Tell me your goal…"}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-neon/50 focus:outline-none"
              />
              <MicButton voice={voice} onTranscript={handleTranscript} disabled={thinking} />
              <VoiceCallButton voice={voiceConversation} onStart={startVoiceConversation} />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon text-[#080808] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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