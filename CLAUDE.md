<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: 3fab2c5 -->
<!-- platform: claude-code | tier: T2 | version: 1.2.0 | policy: ai-agent-policy@wrapper | updated: 2026-03-18 -->

# CLAUDE.md — codespaces-blank

**Charter binding:** Activ8 AI Operational Execution & Accountability Charter (v1.5).

## What to read first

- `docs/SOURCES-OF-TRUTH.md` (this repo)
- `docs/AUDIENCE-SURFACE-CONTRACT.md` (this repo)
- Central canonical SSOT map: `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `docs/SOURCES-OF-TRUTH.md`

## Output contract

`Progress | Evidence | Blockers`

## Execution Rule

- Obvious-Answer Question Elimination Rule applies.
- If the next action is already clear, execute it instead of asking.

## Seek-First Planning Gate

- No action begins without a plan.
- Verify in order: Notion first, then repo, then local/runtime files.
- Search for existing artifacts before touching or proposing anything new.
- Build on established work whenever possible; create new only when no suitable precedent exists.

## Seek First to Understand + Verify What Exists

- **Seek First to Understand:** before answering, deciding, or acting, gather context and ensure full comprehension.
- **Verify what exists in Notion:** never assume. Check Notion first. Confirm presence, accuracy, and status of relevant information before proceeding.
- **Search for existing artifacts:** look for relevant databases, pages, prior work, and connected surfaces before touching, modifying, or proposing anything new.
- **Build on established work:** extend, refine, or elevate what exists. Respect artifact lineage.
- **Create new only when necessary:** new artifacts or structures only when no suitable reference, structure, or precedent exists.
- **Fail closed on deviation:** if verification is missing, the user correction changes the path, or drift is detected, stop, surface the mismatch, and restart from verified state.

## Managed Repo Contract

- Validate with `npm run operationalize:build`.
- Run `npm run operationalize:repo -- --with-sync` in closeout-capable flows when Notion is available.

## Trace + Audience Rule

- Assume prior lineage exists unless trace search proves otherwise.
- Use `docs/AUDIENCE-SURFACE-CONTRACT.md` to classify the active surface and bind `Genesis`, `Trace Origin`, and `Canonical Source` before introducing new governed artifacts.
