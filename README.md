# Horizon Admin Portal

A React + Vite admin dashboard for Horizon Home Inspections, designed for deployment to Netlify at <https://portal.horizonhomeva.com>.

## Features
- Supabase email/password authentication with Horizon team role checks (`admin` and `inspector`).
- Dashboard with sortable inspections table and calendar confirmation workflow.
- Inspectors directory with calendar shortcuts and active inspection load counts.
- Clients listing with quick filters for buyers and realtors.
- Admin-only settings for managing inspectors and future round-robin scheduling.
- Admin-only settings for managing inspectors (via Netlify function `createInspector`) and future round-robin scheduling.
- TailwindCSS styling using Horizon brand palette.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**

   Create a `.env` file based on `.env.example` and provide the values from Netlify (or your Supabase project):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_API_BASE_URL=/.netlify/functions
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Authentication Notes
- Only team members listed in the `team_profiles` table with roles `admin` or `inspector` can log in.
- The reusable `useSupabaseAuth` hook manages sessions, login, logout, and redirect logic.

## Round-robin Scheduling Placeholder
Future work to integrate automated round-robin scheduling should hook into the TODO comment inside `services/team.ts#createInspector`. This is where you can trigger Netlify functions or Supabase Edge Functions once the assignment workflow is ready.

The settings form posts to the Netlify function `/.netlify/functions/createInspector`, which should wrap Supabase Admin SDK calls on the server (never expose the service role key to the client).

## Deployment
- Netlify builds the app using `npm run build` and serves the generated `dist/` folder.
- `netlify.toml` includes a catch-all redirect to `index.html` for SPA routing.

## Local Development without Supabase
If Supabase or Netlify functions are unreachable locally, the portal automatically falls back to realistic mock data for inspections, clients, and inspectors so you can continue iterating on the UI.
