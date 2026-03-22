# Vercel Deployment

This project is ready to deploy on Vercel from the `main` branch.

## Project Setup

- Repository: `dinhhaunguyen88-png/Ung-dung-cho-con`
- Root directory: project root
- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## API Setup

- Frontend routes are served by Vite.
- API routes are rewritten by [vercel.json](/d:/ung dung - Copy/ung dung/Dinh-Hau-Nguyen/vercel.json).
- Vercel entrypoint: [api/index.ts](/d:/ung dung - Copy/ung dung/Dinh-Hau-Nguyen/api/index.ts)
- Express app source: [src/server/index.ts](/d:/ung dung - Copy/ung dung/Dinh-Hau-Nguyen/src/server/index.ts)

## Environment Variables

Add these variables in Vercel Project Settings -> Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`

Optional:

- `GEMINI_API_KEY`

Reference template: [.env.example](/d:/ung dung - Copy/ung dung/Dinh-Hau-Nguyen/.env.example)

## Supabase Checklist

Before deploying, make sure the target Supabase project already has the required tables and columns.

- Run the SQL files in `migrations/`
- Confirm the `users`, `pets`, `progress`, `classes`, `assignments`, and `shop` tables exist
- Prefer `SUPABASE_SERVICE_ROLE_KEY` in production so the API does not depend on relaxed anon policies

## Deploy Flow

1. Open Vercel and import the GitHub repository.
2. Select branch `main`.
3. Confirm the build settings above.
4. Add the environment variables.
5. Deploy.

## Post-Deploy Checks

After the first deploy, verify:

- `GET /api/system/status` returns `summary.ready: true`
- `supabase.accessMode` is `service_role`
- `auth.mode` is `env`
- The dashboard loads question counts
- Creating a student profile also creates the starter pet with the chosen name
- Leaderboard works in both `XP` and `Most Correct` modes

## Common Failures

- Missing `SUPABASE_SERVICE_ROLE_KEY`: writes may fail due to RLS
- Missing `AUTH_SECRET`: teacher auth falls back to insecure dev mode
- Missing migrations: endpoints fail with `relation does not exist` or `column does not exist`
