# WeLaunch

Next.js app for WeLaunch workspace onboarding, agent recommendations, vision roadmaps, ROI demos, and the **Talk to Aria** voice experience powered by [ElevenLabs Conversational AI](https://elevenlabs.io/docs/eleven-agents/libraries/react).

## Routes

- **`/`** — App entry point. Handles OAuth `?code=...`, resumes signed-in users, and sends signed-out users to `/start`.
- **`/start`** — Sign-in/sign-up entry point for workspace onboarding.
- **`/onboarding`** — Workspace creation interview.
- **`/talk-to-aria`** — Voice agent UI (client-side; uses `@elevenlabs/react`).
- **`/api/elevenlabs-token`** — Server-only `POST` that mints a signed WebSocket URL for the agent (never expose the API key in the browser).

## Environment variables

Set these for local dev (`.env.local`) and in production (e.g. Vercel):

| Variable | Required | Description |
|----------|----------|-------------|
| `ELEVENLABS_API_KEY` | **Yes** | Your ElevenLabs API key. Used only on the server in the token route. |
| `ELEVENLABS_AGENT_ID` | No | Agent ID for signed URL. Defaults to `agent_7701kpawyap3f3qt28vjpzexgmda` if unset. |
| `NOTION_TOKEN` | For `/blog` | Notion integration token. Blog stays empty until this and the database ID are set. |
| `NOTION_DATABASE_ID` | For `/blog` | Notion database of published posts (`Status` = Published). |
| `BLOG_REVALIDATE_SECRET` | No | Shared secret for `GET`/`POST` `/api/revalidate-blog` to bust the blog cache. |

Without `ELEVENLABS_API_KEY`, `/api/elevenlabs-token` will fail and the voice page cannot connect.

Share the Notion database with the integration, then set `Status` to **Published** on pages you want live. Covers and inline images are proxied through `/api/notion-asset` so Notion signed URLs do not expire in the browser.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the app entry point and [http://localhost:3000/talk-to-aria](http://localhost:3000/talk-to-aria) for the voice page.

```bash
npm run build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [ElevenLabs React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react)
