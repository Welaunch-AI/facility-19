# Facility19

Next.js marketing site for Facility19, including the **Talk to Aria** voice experience powered by [ElevenLabs Conversational AI](https://elevenlabs.io/docs/eleven-agents/libraries/react).

## Routes

- **`/`** — Landing page, served from the static bundle in `public/facility/`.
- **`/partners`** — Partner program.
- **`/talk-to-aria`** — Voice agent UI (client-side; uses `@elevenlabs/react`).
- **`/privacy-policy`**, **`/legal/terms-of-service`**, **`/sms-policy`** — Legal pages.
- **`/api/elevenlabs-token`** — Server-only `POST` that mints a signed WebSocket URL for the agent (never expose the API key in the browser).
- **`/api/walkthrough-lead`** — Forwards walkthrough requests to the n8n webhook.

## Environment variables

Set these for local dev (`.env.local`) and in production (e.g. Vercel):

| Variable | Required | Description |
|----------|----------|-------------|
| `ELEVENLABS_API_KEY` | **Yes** | Your ElevenLabs API key. Used only on the server in the token route. |
| `ELEVENLABS_AGENT_ID` | No | Agent ID for signed URL. Defaults to `agent_7701kpawyap3f3qt28vjpzexgmda` if unset. |

Without `ELEVENLABS_API_KEY`, `/api/elevenlabs-token` will fail and the voice page cannot connect.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/talk-to-aria](http://localhost:3000/talk-to-aria) for the voice page.

```bash
npm run build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [ElevenLabs React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react)
