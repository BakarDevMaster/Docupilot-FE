## DocuPilot Frontend (Next.js)

Tailwind-designed UI for DocuPilot. No API wiring yet; mock data only.

## Run locally
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

## Environment
Create a `.env.local` (or use the provided `.env.example`):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Deploy to Vercel (monorepo)
- In Vercel: Import from GitHub.
- Set **Root Directory** to `frontend`.
- Build command: `npm run build` (default).
- Output directory: `.next` (default).
- Env vars: `NEXT_PUBLIC_API_BASE_URL=https://your-backend-host`.

## Pages
- `/` landing
- `/dashboard`, `/documents`, `/versions`
- `/auth` (login UI placeholder)

## Notes
- Client components marked where hooks are used.
- Sidebar has mobile drawer; Navbar includes menu toggle placeholder.
