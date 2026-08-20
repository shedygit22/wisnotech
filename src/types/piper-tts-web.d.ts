declare module "piper-tts-web" {
  export interface PiperGenerateResponse {
    phonemeData: unknown;
    file: Blob;
    duration: number;
  }

  export class PiperWebEngine {
    constructor(opts?: {
      onnxRuntime?: unknown;
      phonemizeRuntime?: unknown;
      expressionRuntime?: unknown;
      voiceProvider?: unknown;
    });
    generate(text: string, voice: string, speaker?: number): Promise<PiperGenerateResponse>;
    destroy(): void;
  }

  export class OnnxWebRuntime {
    constructor(opts?: { basePath?: string; numThreads?: number });
    destroy(): void;
  }

  export class PhonemizeWebRuntime {
    constructor(opts?: { basePath?: string });
    destroy(): void;
  }

  export class HuggingFaceVoiceProvider {
    constructor(opts?: { baseUrl?: string; separator?: string });
    list(): Promise<Record<string, unknown>>;
    destroy(): void;
  }
}