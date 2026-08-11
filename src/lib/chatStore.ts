import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type { AssistState } from "./assistant";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  href?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  /** Optional sales-assistant state so history restores conversation context. */
  state?: AssistState;
}

const STORAGE_KEY = "wisnotech.chat.sessions.v1";
const MAX_SESSIONS = 30;

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sanitize(sessions: unknown): ChatSession[] {
  if (!Array.isArray(sessions)) return [];
  return sessions
    .filter(
      (s): s is ChatSession =>
        !!s &&
        typeof s === "object" &&
        typeof (s as ChatSession).id === "string" &&
        Array.isArray((s as ChatSession).messages)
    )
    .slice(0, MAX_SESSIONS);
}

function loadFromStorage(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function hydrate(): ChatSession[] {
  const list = loadFromStorage();
  if (list.length === 0) return [];
  return list.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function titleFor(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New conversation";
  const t = firstUser.text.replace(/\s+/g, " ").trim();
  return t.length > 40 ? `${t.slice(0, 40)}…` : t;
}

/* ------------------------------------------------------------------ */
/* Shared singleton store — every chat UI reads/writes the same state. */
/* ------------------------------------------------------------------ */

type Store = {
  sessions: ChatSession[];
  activeId: string | null;
};

const listeners = new Set<() => void>();
let store: Store = { sessions: hydrate(), activeId: null };
let booted = false;

function emit(): void {
  for (const l of listeners) l();
}

function commitStore(next: Store): void {
  store = next;
  sortSessions();
  try {
    const withUser = store.sessions.filter(
      (s) => (s.messages ?? []).some((m) => m.role === "user")
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withUser.slice(0, MAX_SESSIONS)));
  } catch {
    /* non-fatal */
  }
  emit();
}

function sortSessions(): void {
  store = { ...store, sessions: [...store.sessions].sort((a, b) => b.updatedAt - a.updatedAt) };
}

function getSnapshot(): Store {
  return store;
}

/* ------------------------------------------------------------------ */
/* Public store API                                                   */
/* ------------------------------------------------------------------ */

/**
 * Seed the very first session when nothing has ever been stored.
 * Only one chat UI (whichever mounts first) does this.
 */
export function ensureSession(welcome: (sessions: ChatSession[]) => ChatMessage[]): void {
  if (booted) return;
  booted = true;
  const existing = loadFromStorage();
  if (existing.length > 0) {
    store = { sessions: existing, activeId: existing[0].id };
    emit();
    return;
  }
  const fresh: ChatSession = {
    id: newSessionId(),
    title: "New conversation",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: welcome([]),
  };
  store = { sessions: [fresh], activeId: fresh.id };
  emit();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getSessions(): ChatSession[] {
  return store.sessions;
}

export function getActiveId(): string | null {
  return store.activeId;
}

export function openSession(id: string): void {
  if (!store.sessions.some((s) => s.id === id)) return;
  commitStore({ ...store, activeId: id });
}

export function createSession(welcome: (sessions: ChatSession[]) => ChatMessage[]): ChatSession {
  const fresh: ChatSession = {
    id: newSessionId(),
    title: "New conversation",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: welcome(store.sessions),
  };
  commitStore({ sessions: [fresh, ...store.sessions], activeId: fresh.id });
  return fresh;
}

export function deleteSession(id: string): void {
  const remaining = store.sessions.filter((s) => s.id !== id);
  if (remaining.length === 0) {
    const fresh: ChatSession = {
      id: newSessionId(),
      title: "New conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    commitStore({ sessions: [fresh], activeId: fresh.id });
    return;
  }
  const nextActive = store.activeId === id ? remaining[0].id : store.activeId;
  commitStore({ sessions: remaining, activeId: nextActive });
}

export function addToSession(id: string, m: ChatMessage): void {
  const target = store.sessions.find((s) => s.id === id);
  if (!target) return;
  const updated: ChatSession = {
    ...target,
    title:
      target.title === "New conversation" ? titleFor([...target.messages, m]) : target.title,
    updatedAt: Date.now(),
    messages: [...target.messages, m],
  };
  commitStore({
    sessions: store.sessions.map((s) => (s.id === id ? updated : s)),
    activeId: store.activeId,
  });
}

export function commitSession(
  id: string,
  messages: ChatMessage[],
  title?: string,
  state?: AssistState
): void {
  const target = store.sessions.find((s) => s.id === id);
  if (!target) return;
  const updated: ChatSession = {
    ...target,
    title:
      title ??
      (target.title === "New conversation" && messages.length ? titleFor(messages) : target.title),
    updatedAt: Date.now(),
    messages,
    state: state ?? target.state,
  };
  commitStore({
    sessions: store.sessions.map((s) => (s.id === id ? updated : s)),
    activeId: store.activeId,
  });
}

/* ------------------------------------------------------------------ */
/* Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseChatSessionsOptions {
  /** Messages to seed a brand-new session with. */
  welcome: (sessions: ChatSession[]) => ChatMessage[];
  /** Whether to auto-seed the first session on app load. Default true. */
  autoSeed?: boolean;
}

export interface UseChatSessions {
  sessions: ChatSession[];
  activeId: string | null;
  active: ChatSession | null;
  messages: ChatMessage[];
  open: (id: string) => void;
  newChat: () => ChatSession;
  deleteChat: (id: string) => void;
  add: (m: ChatMessage) => void;
  commit: (messages: ChatMessage[]) => void;
}

/**
 * localStorage-backed multi-session chat with a shared singleton store:
 * history persists across reloads and is identical in every chat UI
 * (floating assistant, AI Studio). Sessions auto-restore the most recent.
 */
export function useChatSessions({ welcome, autoSeed = true }: UseChatSessionsOptions): UseChatSessions {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    if (autoSeed) ensureSession(welcome);
  }, [autoSeed, welcome]);

  const sessions = snapshot.sessions;
  const activeId = snapshot.activeId;
  const active = sessions.find((s) => s.id === activeId) ?? null;

  const open = useCallback((id: string) => {
    openSession(id);
  }, []);

  const newChat = useCallback((): ChatSession => {
    return createSession(welcome);
  }, [welcome]);

  const deleteChat = useCallback((id: string) => {
    deleteSession(id);
  }, []);

  const add = useCallback(
    (m: ChatMessage) => {
      const id = getActiveId();
      if (id) addToSession(id, m);
    },
    []
  );

  const commit = useCallback(
    (messages: ChatMessage[]) => {
      const id = getActiveId();
      if (id) commitSession(id, messages);
    },
    []
  );

  return {
    sessions,
    activeId,
    active,
    messages: active?.messages ?? [],
    open,
    newChat,
    deleteChat,
    add,
    commit,
  };
}