/** Conversation status shared by the in-browser voice mode (Piper-backed loop). */
export type VoiceStatus = "off" | "connecting" | "listening" | "thinking" | "speaking";

export const VOICE_STATUS_TEXT: Record<VoiceStatus, string> = {
  off: "Voice conversation ended",
  connecting: "Preparing Wisne's voice…",
  listening: "I'm listening",
  thinking: "Wisne is speaking",
  speaking: "Wisne is speaking",
};