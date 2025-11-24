from __future__ import annotations

"""Demonstration entrypoint for the Industry Mesh wiring."""

from clients.matrix import get_client_matrix
from codex.bindings import CodexBinding
from custodian_hub.logger import CustodianLogger
from maos.industry_mesh import IndustryMeshIntegrator
from modules.portal_sync.portal_sync import NotionClient, PortalSync
from performance.telemetry import PerformanceTelemetry
from teamwork_pipeline.pipeline import TeamworkClient, TeamworkPipeline
from writer.charter_writer import CharterWriter


def build_integrator() -> IndustryMeshIntegrator:
    writer = CharterWriter()
    clients = get_client_matrix()
    logger = CustodianLogger()
    teamwork_client = TeamworkClient()
    teamwork_pipeline = TeamworkPipeline(teamwork_client, clients, writer, logger)
    portal_sync = PortalSync(NotionClient(), logger)
    codex_binding = CodexBinding()
    telemetry = PerformanceTelemetry()

    return IndustryMeshIntegrator(
        clients=clients,
        writer=writer,
        teamwork_pipeline=teamwork_pipeline,
        portal_sync=portal_sync,
        logger=logger,
        codex_binding=codex_binding,
        performance_telemetry=telemetry,
    )


def sample_event() -> dict:
    return {
        "event_type": "maos.industry.signal",
        "event_id": "industry:martech:2025-11-24T03:00:00Z",
        "source": "MarTech",
        "headline": "Meta rolls out Advantage+ 3.0 for DTC brands",
        "sector": ["Advertising", "Ecommerce"],
        "impact": ["Ads", "Programmatic", "Creative"],
        "urgency": 3,
        "volatility": 0.41,
        "confidence": 0.86,
        "timestamp": "2025-11-24T03:00:00Z",
        "links": ["https://martech.org/..."],
        "semantic_cluster": "adtech_update",
        "system_refs": ["enc:meta_ads", "enc:digital_advertising"],
        "affected_clients": ["modern_office", "discount_equipment"],
        "action_recommendations": [
            "Test new Advantage+ creative automation",
            "Evaluate effect on CPC for DTC-focused clients",
        ],
    }


def main() -> None:
    integrator = build_integrator()
    integrator.process_signal(sample_event())


if __name__ == "__main__":
    main()
