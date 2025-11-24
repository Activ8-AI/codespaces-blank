# Industry Mesh Wiring Details

## Reflex DAG & Action Matrix
- `configs/reflex_dag.yaml` registers `industry_reflex` with confidence ≥ 0.75 and urgency ≥ 2.
- `configs/action_matrix.yaml` maps the signal → reflex, thresholds, weights, and defines execution (`dispatch` via Teamwork) plus portal sync binding (`industry_radar`).

## Handler Contract
`reflex_handlers/industry_reflex.handle(event, clients, writer)` returns execution intents that include:
- Client metadata: `client_id`, `sector`, `semantic_cluster`.
- Operational fields: urgency, confidence, due date, charter summary, recommended actions, source evidence.
- `portal_payload` (summary, recommended actions, metrics) ready for PortalSync.

## Execution Routing
`maos/industry_mesh.IndustryMeshIntegrator.process_signal()` wires:
1. Custodian Hub ingestion log.
2. Reflex evaluation → `TeamworkPipeline.dispatch`.
3. Portal updates via `PortalSync.industry_radar` using the schema:
   - Client, Source, Headline, Sector, Impact Areas, Urgency, Volatility, Confidence, Summary, Recommended Actions, Links, Timestamp, Event ID.
4. Codex bindings (`codex/bindings.py`) update both systems timeline and client strategy timeline.
5. Performance telemetry emission for Reflex feedback loop (`performance/telemetry.py`).

## Custodian Hub
`custodian_hub/logger.CustodianLogger` writes structured JSONL:
- `industry_ingest` — hash, provenance, signer.
- `industry_reflex` — reflex decision metadata.
- `teamwork_pipeline_dispatch` and `portal_sync.industry_radar` entries (via `audit`).
Files land under `logs/industry_mesh/YYYY/MM/DD/events.jsonl`.

## Codex Bindings
- Systems Encyclopedia: `record_system_events()` writes each `system_ref` with signal metadata.
- Client Strategy Layer: `record_client_event()` writes signal + action context per client for later KPI mapping.

## Performance Loop
`PerformanceTelemetry.emit()` is the hook for reflex scoring. Integrate the production scorer by replacing this stub with the live transport (e.g., Kafka topic) so Action Matrix weights can adapt over time.
