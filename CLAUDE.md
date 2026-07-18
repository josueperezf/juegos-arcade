# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Juegos Arcade — a platform for playing games online and competing for high scores. Currently a fresh `create-next-app` scaffold (Next.js 16.2.10, React 19.2.4, Tailwind CSS 4, TypeScript) with no game logic implemented yet: `app/page.tsx` is still the default template.

## Commands

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production build
npm run lint    # eslint
```

No test runner is configured yet.

## Next.js version caveat

This repo uses Next.js 16, which has breaking changes vs. earlier versions your training data may assume. Before writing Next.js code, check `node_modules/next/dist/docs/` for the current API/conventions (see AGENTS.md).

## Spec-driven workflow

This project follows spec-driven development using the `/spec` and `/spec-impl` commands from the `fernando-skills` package (https://github.com/Klerith/fernando-skills), installed via:

```bash
npx skills@latest add Klerith/fernando-skills
```

Prefer writing a spec before implementing new game features when these commands are available.

## Design references

`references/templates/` contains a standalone HTML/JSX prototype ("Arcade Vault") of the intended product: a game library, game detail/player, auth, and hall-of-fame screens, plus mock game data and a shared stylesheet (`styles.css`, neon/pixel arcade theme). These files use global `React`/`ReactDOM` and `localStorage`, not Next.js conventions — treat them as design/content reference only, not code to import directly. Consult them for intended screens, routes, and mock data shape when writing specs or implementing real `app/` routes and components.
