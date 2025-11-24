# Industry Intelligence Mesh Wiring

This repository wires the MAOS Industry Mesh signal (`maos.industry.signal`) into every downstream system defined in the brief: Reflex DAG, Action Matrix, Teamwork MCP, Client Intelligence Portal, Custodian Hub, Codex, and Performance Telemetry.

## Components

- `configs/reflex_dag.yaml` — adds the `industry_reflex` node listening to `maos.industry.signal` with Charter thresholds.
- `configs/action_matrix.yaml` — maps the reflex into Action Matrix thresholds, weights, execution pipeline (`dispatch`) and portal sync binding (`industry_radar`).
- `reflex_handlers/industry_reflex.py` — turns an incoming event into execution intents plus portal payloads per client.
- `maos/industry_mesh.py` — orchestrator that logs ingestion, fires the reflex, dispatches Teamwork tasks, syncs the portal, records Codex knowledge, and emits telemetry for the performance loop.
- `teamwork_pipeline/pipeline.py` — Teamwork MCP dispatch implementation.
- `modules/portal_sync/portal_sync.py` — `PortalSync.industry_radar` implementation targeting the `client_industry_radar` database schema.
- `custodian_hub/logger.py` — writes ingestion, reflex, portal, and execution logs under `logs/industry_mesh/YYYY/MM/DD/events.jsonl` for Custodian Hub.
- `codex/bindings.py` — System encyclopedia & client strategy bindings; each signal enriches both layers.
- `writer/charter_writer.py` — Charter-standard summaries and action copy used everywhere.
- `performance/telemetry.py` — Reflex performance feedback hook (placeholder transport).
- `clients/matrix.py` — canonical client matrix with Teamwork project IDs.
- `main.py` — runnable example that processes the provided MarTech Advantage+ signal end-to-end.

## Running the Wiring

```bash
python main.py
```

This will:
1. Log ingestion of the sample signal (`logs/industry_mesh/...`).
2. Generate execution intents via `industry_reflex`.
3. Dispatch tasks/subtasks/sprints into Teamwork MCP (stubbed client in this repo).
4. Create portal rows in `client_industry_radar` via `PortalSync.industry_radar`.
5. Record Codex system + client entries.
6. Emit performance telemetry payloads.

Integrate your production adapters by swapping the stub clients (`TeamworkClient`, `NotionClient`, telemetry emitter) with live implementations — the wiring contracts already match the spec.
