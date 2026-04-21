# Facility 19

Next.js app that serves the Facility marketing site and an internal **Talk to Aria** voice experience powered by [ElevenLabs Conversational AI](https://elevenlabs.io/docs/eleven-agents/libraries/react).

## Routes

- **`/`** — Static Facility bundle from `public/facility/` (rewritten in `next.config.ts`).
- **`/talk-to-aria`** — Voice agent UI (client-side; uses `@elevenlabs/react`).
- **`/api/elevenlabs-token`** — Server-only `POST` that mints a signed WebSocket URL for the agent (never expose the API key in the browser).

## Environment variables

Set these for local dev (`.env.local`) and in production (e.g. Vercel):

| Variable | Required | Description |
|----------|----------|-------------|
| `ELEVENLABS_API_KEY` | **Yes** | Your ElevenLabs API key. Used only on the server in the token route. |
| `ELEVENLABS_AGENT_ID` | No | Agent ID for signed URL. Defaults to `agent_7701kpawyap3f3qt28vjpzexgmda` if unset. |

Without `ELEVENLABS_API_KEY`, `/api/elevenlabs-token` will fail and the voice page cannot connect.

## Facility static assets & CTAs

The files under `public/facility/` are **generated** by unpacking a source bundle:

```bash
npm run facility:unpack
```

The unpack script (`scripts/unpack-facility.mjs`) rewrites outbound “Meet Aria / Talk to Aria” links from the old external URL to **`/talk-to-aria`**, adjusts `target` attributes where needed, and updates footer metadata. **Re-run `facility:unpack` after changing the script** so regenerated JS stays consistent.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the Facility site and [http://localhost:3000/talk-to-aria](http://localhost:3000/talk-to-aria) for the voice page.

```bash
npm run build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [ElevenLabs React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react)
