# Cohord GraphQL Profile

A tiny Vite + vanilla JS app that lets you log in to the Zone01 platform, run a GraphQL query, and display the resulting stats.

## Requirements
- Node.js 18+ and npm

## Run It (local)
1. clone the repo and `cd graphql`
2. install deps: `npm install`
3. start dev server: `npm run dev` (default `http://localhost:5173`)
   - By default it talks directly to `https://platform.zone01.gr` (no local proxy). If you want to use the Netlify proxy locally, set `VITE_API_BASE=/zone01` and run `netlify dev`.

## Build It
```bash
npm run build
```
The static site lands in `dist/`. You can test that build with `npm run preview` or deploy the folder to any static host.

## Deploy to GitHub Pages
This repo is configured for Pages with Vite’s `base` set to `/graphql/`.

1. Push `main` to GitHub.
2. Ensure Pages uses GitHub Actions in repo Settings → Pages.
3. The provided workflow (`.github/workflows/pages.yml`) runs `npm ci`, builds, and publishes `dist/` to Pages on every push to `main`.

Note: The backend at `https://platform.zone01.gr` currently returns invalid CORS headers. You’ll need a proxy or backend fix for auth requests to work from Pages.
