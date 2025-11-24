from __future__ import annotations

"""Industry Reflex handler for maos.industry.signal events."""

from typing import Any, Dict, List


def handle(event: Dict[str, Any], clients: Dict[str, Dict[str, Any]], writer) -> List[Dict[str, Any]]:
    execution_intents: List[Dict[str, Any]] = []

    for client_id in event.get("affected_clients", []):
        if client_id not in clients:
            continue

        title = f"[Industry] {event.get('headline', 'Signal')}"
        desc = writer.industry_brief(event=event, client_id=client_id)
        actions = writer.industry_actions(event=event, client_id=client_id)

        portal_payload = {
            "source": event.get("source"),
            "headline": event.get("headline"),
            "sector": event.get("sector", []),
            "impact": event.get("impact", []),
            "urgency": event.get("urgency"),
            "volatility": event.get("volatility"),
            "confidence": event.get("confidence"),
            "summary": desc,
            "recommended_actions": actions,
            "links": event.get("links", []),
            "timestamp": event.get("timestamp"),
            "event_id": event.get("event_id"),
        }

        intent = {
            "client_id": client_id,
            "reflex": "industry_reflex",
            "urgency": event.get("urgency"),
            "title": title,
            "description": desc,
            "actions": actions,
            "due_date": writer.derive_due(event),
            "tags": ["reflex", "auto", "industry", "mesh"],
            "evidence_urls": event.get("links", []),
            "source_event": event.get("event_id"),
            "confidence": event.get("confidence"),
            "sector": event.get("sector", []),
            "semantic_cluster": event.get("semantic_cluster"),
            "portal_payload": portal_payload,
        }
        execution_intents.append(intent)

    return execution_intents
