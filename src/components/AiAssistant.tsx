import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X, ArrowUpRight } from "lucide-react";
import { askServerWithFallback } from "../lib/api";
import {
  createInitialState,
  contextMessage,
  openingLine,
  exitIntentMessage,
  quickReplies,
  type AssistState,
} from "../lib/assistant";

interface Message {
  role: "assistant" | "user";
  text: string;
  href?: string;
}

const SECTION_IDS = [
  { id: "home", label: "home" },
  { id: "services", label: "services" },
  { id: "showreel", label: "showreel" },
  { id: "creations", label: "creations" },
  { id: "about", label: "about" },
  { id: "solutions", label: "solutions" },
  { id: "academy", label: "academy" },
  { id: "assistant", label: "assistant" },
  { id: "contact", label: "contact" },
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [state, setState] = useState<AssistState>(() => createInitialState());
  const stateRef = useRef(state);
  stateRef.current = state;
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [attention, setAttention] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const promptedRef = useRef(false);

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
        setMessages((m) => [
          ...m,
          { role: "assistant", text: exitIntentMessage(state.name) },
        ]);
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
        setMessages((m) =>
          m.length > 0 ? m : [{ role: "assistant", text: msg }]
        );
        setAttention(true);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [currentSection, open]);

  const push = useCallback((m: Message) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const openChat = useCallback(() => {
    setOpen(true);
    setAttention(false);
    setMessages((m) => {
      if (m.length === 0) {
        return [{ role: "assistant", text: openingLine(state) }];
      }
      return m;
    });
  }, [state]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const submit = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || thinking) return;
      push({ role: "user", text: question });
      setInput("");
      setThinking(true);

      // Build the conversation history sent to the LLM backend.
      const history = messages
        .map((m) => ({ role: m.role, content: m.text }))
        .concat([{ role: "user" as const, content: question }]);

      const reply = await askServerWithFallback(question, stateRef.current, history.slice(0, -1));
      setMessages((m) => [
        ...m,
        { role: "assistant", text: reply.text, href: reply.href },
      ]);
      setThinking(false);
    },
    [thinking, push, messages]
  );

  /* Esc closes chat */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
            </div>

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
                  </div>
                </div>
              ))}

              {thinking && (
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
            </div>

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
    </>
  );
}