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
