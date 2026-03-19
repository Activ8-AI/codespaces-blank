<!-- managed-by: activ8-ai-context-pack | pack-version: 1.1.0 -->
<!-- source-sha: bff7ed8 -->
# Prompt Library

This repo carries the Activ8 managed prompt-library minimum contract.

## Required Assets

- `OBVIOUS-ANSWER-QUESTION-ELIMINATION-RULE.md`
- `STOP-RESET-REALIGN-ANTI-AVOIDANCE-PROMPTS.md`
- `AGENT-ANNOUNCEMENT-SRR-ANTI-AVOIDANCE-v1.md`

## Operational Notes

- Keep these files aligned with the central control plane.
- `npm run operationalize:repo -- --with-sync` verifies the required rule exists in the prompt library when Notion is available.
- The Obvious-Answer Question Elimination Rule is a required marker across policy and agent surfaces.
- Agent instruction surfaces must also carry sourced seek-first verification markers: `Seek First to Understand`, `Verify what exists in Notion`, `Search for existing artifacts`, `Build on established work`, and `Fail closed on deviation`.
