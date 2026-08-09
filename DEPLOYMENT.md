# Wisnotech — Vercel Deployment Notes

Live at **https://wisnotech.vercel.app**

## Auto-deploy
This repo is connected to Vercel (`shedrack1/wisnotech`). Pushing to `master`
automatically builds and deploys to production.

## Environment variables (set in Vercel → Settings → Environment Variables)
| Name | Value |
|---|---|
| `LLM_PROVIDER` | `nvidia` |
| `NVIDIA_API_KEY` | your nvapi-... key |
| `NVIDIA_MODEL` | `google/gemma-4-31b-it` |

## Local development
```bash
npm install
npm run dev          # Vite site only
npm run dev:all      # Vite + local AI chat server (port 8787)
npm run build        # typecheck + production build
```

## AI chat backend
- Serverless: `api/chat.mjs` (Vercel) / `netlify/functions/chat.mjs` (Netlify)
- Local dev: `server/chat.mjs`
- Shared core: `api/_core.mjs` (DeepSeek / Google / NVIDIA providers)

## Notes
- `.env` is gitignored — never commit secrets.
- The site falls back to a built-in sales bot if the AI backend is slow or down.
