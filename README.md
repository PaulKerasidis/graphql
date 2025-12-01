# Cohord GraphQL Profile

A tiny Vite + vanilla JS app that lets you log in to the Zone01 platform, run a GraphQL query, and display the resulting stats.

## Requirements
- Node.js 18+ and npm

## Run It
1. clone the repo and `cd graphql`
2. install deps
   ```bash
   npm install
   ```
3. start the dev server
   ```bash
   npm run dev
   ```
   Vite prints the local URL (default `http://localhost:5173`).

## Build It
```bash
npm run build
```
The static site lands in `dist/`. You can test that build with `npm run preview` or deploy the folder to any static host.

## Deploy to Netlify (with CORS-safe proxy)
1) Set an env var in your Netlify site: `VITE_API_BASE=/zone01`
2) Deploy with the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify init       # or link if the site already exists
   netlify deploy     # use --prod to publish
   ```
The bundled Netlify Function (`netlify/functions/zone01.js`) proxies `/zone01/*` to `https://platform.zone01.gr` and handles OPTIONS so GraphQL works without CORS errors in production.

Live demo: https://zone01-pkerasid.netlify.app
