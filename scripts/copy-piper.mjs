import { cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const pkg = join(root, "node_modules", "piper-tts-web", "dist");

cpSync(join(pkg, "onnx"), join(out, "onnx"), { recursive: true });
cpSync(join(pkg, "piper"), join(out, "piper"), { recursive: true });

console.log("Copied Piper WASM assets -> dist/onnx and dist/piper");
