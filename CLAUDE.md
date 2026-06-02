# CLAUDE.md — CLIENT PROJECT (not the dashboard source)

This is a **client website** built on the shared dashboard. Its admin-panel and
data-layer files are **generated copies** from `../client-website-template/`.

## ⚠️ Most important rule
**Never hand-edit core dashboard files in this folder.** They carry a
`⚠️ CORE DASHBOARD FILE` header and are listed in the `CORE_FILES` array inside
`../client-website-template/update-dashboard.js`. Edits made here get
**OVERWRITTEN** on the next dashboard update.

To change dashboard behavior/UI:
1. Edit the file in `../client-website-template/`
2. From that repo: `node update-dashboard.js ../<this-folder>` (try `--dry-run` first)
3. `npm run build` here to verify

## What IS edited directly here (client-specific — never propagated)
- `src/client/clientConfig.js` — this client's sections, sidebar, labels
- `src/components/sections/*`, `src/components/ui/Navbar.jsx`, `src/pages/Home.jsx`
  — this client's layout & section components
These are safe to edit here; the update script never touches them.

## Content (text / images)
- Lives in **Supabase**, edited via the admin panel at `/admin` — NOT in code.
- Which Supabase project is chosen by a local `.env` (gitignored). No `.env` =
  demo mode with no live content.

## Publish model
- Sections + Navigation & Pages: **Save Draft** (private) → **Publish to Live Site**.
- Settings / SEO: **Save & Publish** (one-step, goes live immediately).

## Full workflow
See `client-website-template/DASHBOARD_WORKFLOW.md`.
