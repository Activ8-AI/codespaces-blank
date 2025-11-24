from __future__ import annotations

"""Industry Mesh orchestrator that wires reflex, pipelines, portal, and codex."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from codex.bindings import CodexBinding
from custodian_hub.logger import CustodianLogger
from modules.portal_sync.portal_sync import PortalSync
from performance.telemetry import PerformanceTelemetry
from reflex_handlers import industry_reflex
from teamwork_pipeline.pipeline import TeamworkPipeline


class IndustryMeshIntegrator:
    def __init__(
        self,
        *,
        clients: Dict[str, Dict[str, Any]],
        writer,
        teamwork_pipeline: TeamworkPipeline,
        portal_sync: PortalSync,
        logger: CustodianLogger,
        codex_binding: CodexBinding,
        performance_telemetry: Optional[PerformanceTelemetry] = None,
        signer: str = "lmaai@theleverageway.com",
    ) -> None:
        self.clients = clients
        self.writer = writer
        self.teamwork_pipeline = teamwork_pipeline
        self.portal_sync = portal_sync
        self.logger = logger
        self.codex = codex_binding
        self.performance_telemetry = performance_telemetry
        self.signer = signer

    def process_signal(self, event: Dict[str, Any]) -> List[Dict[str, Any]]:
        self.logger.log_ingest(event, signer=self.signer)

        intents = industry_reflex.handle(event=event, clients=self.clients, writer=self.writer)

        if intents:
            client_ids = [intent["client_id"] for intent in intents]
            self.logger.log_reflex(
                event_id=event.get("event_id"),
                reflex="industry_reflex",
                clients=client_ids,
            )

        system_refs = event.get("system_refs", [])
        if system_refs:
            self.codex.record_system_events(system_refs, event)

        for intent in intents:
            task_id = self.teamwork_pipeline.dispatch(intent)
            portal_payload = intent.get("portal_payload")
            if portal_payload:
                self.portal_sync.industry_radar(intent["client_id"], portal_payload)

            self.codex.record_client_event(intent["client_id"], intent)

            if self.performance_telemetry:
                self.performance_telemetry.emit(
                    {
                        "event_id": event.get("event_id"),
                        "client_id": intent["client_id"],
                        "reflex": intent["reflex"],
                        "task_id": task_id,
                        "created_at": datetime.utcnow().isoformat() + "Z",
                        "kpi_effect": {},
                    }
                )

        return intents
