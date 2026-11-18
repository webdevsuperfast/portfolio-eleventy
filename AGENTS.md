# Repository Guidelines

## Project Overview

Single-page JAMStack portfolio for Rotsen Mark Acob (`https://www.rotsenacob.com/`) built with **Eleventy 3**, **Tailwind CSS 4**, and WordPress as a headless CMS. All site copy — about text, projects, categories, testimonials, social links, SEO metadata — is fetched from WordPress GraphQL **at build time**. This repo holds templates and build wiring, not authored content. Static output is deployed to Cloudflare Pages; the contact form is handled by a Pages Function (`functions/api/contact.js`).

## Architecture & Data Flow

Two build stages write into `dist/`, in this order:

1. **Assets** — `esbuild.config.js` bundles `src/_scripts/_main.js` → `dist/assets/main.bundle.js`, then shells out to `npx @tailwindcss/cli -i src/_styles/_main.css -o dist/assets/main.bundle.css --postcss [--watch|--minify]`.
2. **Site** — `eleventy --quiet` loads `.eleventy.js`, runs the async data files, renders Nunjucks into `dist/`, and copies passthrough assets.

Assets must build first: `src/_includes/layout.njk` hardcodes `/assets/main.bundle.css` and `/assets/main.bundle.js`.

**Data cascade (build time):**

- `src/_data/{site,portfolio,category,testimonials,social}.js` default-export **async functions**; Eleventy awaits them and exposes results as `site`, `portfolio`, `category`, `testimonials`, `social` in templates. Filename = template variable name. `navigation.js` is the only static array.
- Remote data uses `axios` + `axios-cache-interceptor` POSTing to `` `${WP_SITE_URL}/graphql` `` — **not** `eleventy-fetch`. Cache setup is bare `setupCache(axios)` with **no explicit TTL**; content changes require a fresh build or cache clear.
- `env.js` loads `.env` via `dotenv` and exports config keys; data files `import config from '../../env.js'`. Secrets are not exposed to templates.
- Images are downloaded/optimized at build time by the Nunjucks shortcodes `image`, `portfolioImage`, `testimonialImage` (`@11ty/eleventy-img`) into `dist/images/`. The `sanitize` filter strips all tags from WordPress HTML via `sanitize-html`.

**Runtime (browser):** Alpine.js drives all interactivity (stores/data components in `src/_scripts/alpine.js`, plus inline `x-data`). GSAP handles Flip filtering, ScrollTrigger theming, and overlay scroll; VenoBox lightbox; vanilla-lazyload. No client-side framework.

**Serverless:** `functions/api/contact.js` exports `onRequestPost(context)` (Cloudflare Pages Function). It validates Cloudflare Turnstile, remaps fields for Contact Form 7, POSTs to `${env.WP_SITE_URL}/wp-json/contact-form-7/v1/contact-forms/3/feedback`, then redirects to `SITE_URL`. It reads secrets from `context.env`, not `.env`.

**Gotchas:** `src/index.njk` is the only page; sections are includes under `src/_includes/`. `criticalExists`/`getCritical` filters reference `critical.min.css`, which is absent from the repo. `env.devMode` is referenced in `layout.njk` but has no data provider — treat as undefined.

## Key Directories

- `src/` — Eleventy source (input dir; `_includes` is the includes dir).
  - `src/_data/` — build-time data loaders; one file per global template variable.
  - `src/_includes/` — Nunjucks layout and partials (`layout.njk`, `header.njk`, `footer.njk`, `partials/*.njk`).
  - `src/_scripts/` — browser JS modules; `_main.js` is the esbuild entry with side-effect imports only.
  - `src/_styles/` — Tailwind CSS; `_main.css` is the CLI entry, `base.css`/`utilities.css` are layer files, `components.css` is a placeholder.
- `public/` — tracked static assets copied verbatim to the `dist/` root (favicon, `images/background-*.jpg`, `images/favicon/*`).
- `functions/api/` — Cloudflare Pages Functions; `contact.js` handles `POST /api/contact`, matching the form action in `src/_includes/partials/contact.njk`.
- `dist/` — generated, gitignored. Never edit by hand; regenerate with `npm run build`.
- `.cache/` — Eleventy/image cache, gitignored. Clear with `npm run clean`.

## Development Commands

```bash
npm install                  # npm + committed package-lock.json (lockfileVersion 3)
npm run build                # production: esbuild + Tailwind, then Eleventy -> dist/
npm run build:11ty           # Eleventy only (requires dist/assets bundles to exist)
npm run dev                  # esbuild/Tailwind watch + eleventy --serve (BrowserSync, open:true)
npm run dev:11ty             # Eleventy dev server only
npm run clean                # rm -rf dist && rm -rf .cache
npx prettier --write .       # no format script; invoke Prettier directly
```

`npm run dev` sets `NODE_TLS_REJECT_UNAUTHORIZED=0` for a local HTTPS WordPress origin. A build requires `WP_SITE_URL` to be reachable; GraphQL fetch failures can leave templates with empty data.

## Code Conventions & Common Patterns

- **ESM everywhere** (`"type": "module"`). Named/default ES exports; browser entry uses side-effect imports.
- **Formatting** (Prettier config in `package.json`): no semicolons, single quotes, 2-space indent, `trailingComma: "es5"`, `htmlWhitespaceSensitivity: "ignore"`. Exception: `src/_scripts/lazyload.js` uses double quotes/semicolons — don't copy that style.
- **Naming:** kebab-case/lowercase filenames; `_` prefix marks bundle/data entry points (`_main.js`, `_main.css`, `_main.js` in `_scripts`). JS identifiers camelCase; `src/_data/site.js` output keys are snake_case (`google_site_verification`, `turnstile_site_key`) — preserve them, templates depend on them.
- **Templates:** Nunjucks with `{% block body %}` in `layout.njk` and `{% include %}` partials. No macros. Register filters/shortcodes in `.eleventy.js`, not in templates.
- **CSS:** Tailwind v4 CSS-first config in `src/_styles/_main.css` (`@theme`, `@plugin`, `@source`, `@custom-variant dark`, `@apply`, `&` nesting). There is no `tailwind.config.js`; Prettier options live in `package.json`.
- **Error handling:** `graphql-client.js` centralizes GraphQL requests and throws on `errors` or missing `data`; all five `src/_data` loaders catch, `console.error`, and return safe defaults. Browser scripts guard DOM lookups (`if (!button) return`) and use `DOMContentLoaded`/`requestAnimationFrame`.
- **State:** Alpine `Alpine.store`/`Alpine.data` plus inline `x-data`; `localStorage.theme` for dark mode. No client-side state library.
- **Async:** build-time data files are async exports; never add synchronous network calls. Do not introduce `eleventy-fetch` — the project standard is axios + cache interceptor.

## Important Files

- `.eleventy.js` — Eleventy config: dirs (`src` → `dist`, includes `_includes`), passthrough copies (`{ public: './' }`, `src/robots.txt`), `sanitize` filter, three image shortcodes, BrowserSync settings.
- `esbuild.config.js` — JS bundle + Tailwind CLI invocation; hardcoded paths matching `package.json` `config` keys.
- `env.js` / `.env` — dotenv loader and local secrets (`.env` is gitignored; required keys: `WP_SITE_URL`, `SITE_URL`, `EMAIL_ADDRESS`, `RESUME`, `GOOGLE_SITE_VERIFICATION`, `MICROSOFT_SITE_VERIFICATION`, `TURNSTILE_SITE`, `TURNSTILE_SECRET`; optional `WP_GRAPHQL_USER` + `WP_GRAPHQL_APP_PASSWORD` pair enables Basic auth for GraphQL).
- `package.json` — exact build/dev scripts, Prettier options, dependencies.
- `graphql-client.js` — shared WPGraphQL request helper; add auth/timeout handling here, not in individual loaders.
- `postcss.config.js` — `@tailwindcss/postcss`, `postcss-nested-ancestors`, `cssnano`.
- `src/index.njk`, `src/_includes/layout.njk` — only page and HTML shell.
- `src/_data/*.js` — all external content; change GraphQL queries here.
- `functions/api/contact.js` — `/api/contact` endpoint and Turnstile verification.
- `README.md` — description + credits only; no setup docs. `LICENSE` — MIT, 2022.

## Runtime/Tooling Preferences

- **Node + npm** (no `engines` field, no Bun usage). ESM required. `npx` is used at build time for the Tailwind CLI.
- **Tailwind 4 CSS-first** via `@tailwindcss/postcss`; do not add a `tailwind.config.js` or legacy directives.
- **Cloudflare Pages** deployment is inferred from `wrangler` devDependency, ignored `.wrangler`/`.dev.vars`, and the Pages `onRequestPost` signature. No `wrangler.toml` is committed; set env vars as Pages bindings.
- External services: WordPress GraphQL + Contact Form 7 REST (form ID `3`), Cloudflare Turnstile, Google Fonts (`Recursive`), Google/Microsoft site verification. No analytics or third-party form service.
- Ignore build/runtime artifacts: `dist`, `.cache`, `.env`, `.wrangler`, `.dev.vars`, `node_modules`.

## Testing & QA

- **No tests exist**: no `*.test.*`/`*.spec.*` files, no test runner, no `test`/`lint`/`format`/`check` script, no CI workflows, no hooks, no coverage tooling.
- Verification is `npm run build` (the de facto smoke test) plus manual browser inspection; use `npm run dev` for local iteration. Prettier is installed but has no script — run `npx prettier --write .` manually.
- When changing data files, verify the build with a reachable `WP_SITE_URL` and inspect `dist/index.html` for expected content. When changing scripts/styles, confirm both `dist/assets/main.bundle.js` and `dist/assets/main.bundle.css` are regenerated.
- Do not add a test framework or invent test commands without an explicit request; keep changes verifiable through the build.
