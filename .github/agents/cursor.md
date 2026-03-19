<!-- managed-by: activ8-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: 706ef6d -->
<!-- platform: cursor | tier: T2 | version: 1.2.0 | policy: ai-agent-policy@wrapper | updated: 2026-03-18 -->

# Cursor / Composer Agent Instructions — codespaces-blank

**Charter binding:** Activ8 AI Operational Execution & Accountability Charter (v1.5).

## Where to look first (context routing)

- **This repo’s SSOT map:** `docs/SOURCES-OF-TRUTH.md`
- **This repo’s audience + surface contract:** `docs/AUDIENCE-SURFACE-CONTRACT.md`
- **Central SSOT map (canonical):** `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `docs/SOURCES-OF-TRUTH.md`

## Output contract

`Progress | Evidence | Blockers` — no padding.

## Minimal working standard

- Prefer reading sources over guessing.
- Keep context tight: store pointers (paths/IDs), fetch details just-in-time.
- Update `memory/MEMORY.md` when state changes (Live State + Pending).

## Seek-First Planning Gate

- No action begins without a plan.
- Verify in order: Notion first, then repo, then local/runtime files.
- Search for existing artifacts before touching or proposing anything new.
- Build on lineage before create-new.
- For non-trivial work, externalize a short plan with objective, evidence, options, recommendation, and next action.

## Seek First to Understand + Verify What Exists

- **Seek First to Understand:** before answering, deciding, or acting, gather context and ensure full comprehension.
- **Verify what exists in Notion:** never assume. Check Notion first. Confirm presence, accuracy, and status of relevant information before proceeding.
- **Search for existing artifacts:** look for relevant databases, pages, prior work, and connected surfaces before touching, modifying, or proposing anything new.
- **Build on established work:** extend, refine, or elevate what exists. Respect artifact lineage.
- **Create new only when necessary:** new artifacts or structures only when no suitable reference, structure, or precedent exists.
- **Fail closed on deviation:** if verification is missing, the user correction changes the path, or drift is detected, stop, surface the mismatch, and restart from verified state.

## Obvious-Answer Question Elimination Rule

- Do not end with a question when the user already made the next action clear.
- Execute the next obvious step and return the result.

## Managed Repo Operationalization

- This repo is governed by the Activ8 context pack contract.
- Keep `npm run operationalize:repo` available and `.github/workflows/build-operationalization.yml` installed.

## Automatic Source Bootstrap

- Use `memory/session-brief.md` as the first session-start pointer set.
- `scripts/session-boot.mjs` must populate the brief with automatic source-bootstrap results from `scripts/query-source-ladder.mjs`.
- If the bootstrap binding is missing, stop and repair the managed contract before continuing.

## Trace + Surface Handling

- Assume the active concept or artifact already has prior lineage unless trace search proves otherwise.
- Use `docs/AUDIENCE-SURFACE-CONTRACT.md` to classify the surface you are touching.
- When changing governed surfaces, bind `Canonical Source`, `Genesis`, and `Trace Origin` before treating the work as final.
