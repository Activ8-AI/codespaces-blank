from __future__ import annotations

"""Charter-standard writer utilities for Reflex outputs."""

from datetime import datetime, timedelta
from typing import Any, Dict, List


class CharterWriter:
    """Produces industry briefs and downstream action payloads."""

    def __init__(self, default_tz: str = "UTC") -> None:
        self.default_tz = default_tz

    def industry_brief(self, event: Dict[str, Any], client_id: str) -> str:
        headline = event.get("headline", "Industry Update")
        sector = ", ".join(event.get("sector", [])) or "General"
        impact = ", ".join(event.get("impact", [])) or "Multi"
        urgency = event.get("urgency", "-")
        volatility = event.get("volatility", "-")
        confidence = event.get("confidence", "-")
        summary = (
            f"{headline} impacts {sector} with focus on {impact}. "
            f"Urgency {urgency} / Volatility {volatility:.2f} / Confidence {confidence:.2f}. "
            f"Client {client_id} should prep mitigation and revenue capture measures."
        )
        return summary

    def industry_actions(self, event: Dict[str, Any], client_id: str) -> List[str]:
        base_actions = event.get("action_recommendations") or []
        enriched_actions = [
            f"Validate relevance for {client_id}: {action}" for action in base_actions
        ]
        if not enriched_actions:
            enriched_actions.append(
                f"Run strategic review for {client_id} against latest industry reflex signal."
            )
        return enriched_actions

    def derive_due(self, event: Dict[str, Any]) -> str:
        urgency = event.get("urgency", 1)
        event_time = self._parse_dt(event.get("timestamp"))
        delta = timedelta(days=1)
        if urgency >= 4:
            delta = timedelta(hours=12)
        elif urgency == 3:
            delta = timedelta(days=2)
        due_date = event_time + delta
        return due_date.date().isoformat()

    def attach_brief(self, execution_intent: Dict[str, Any]) -> str:
        description = execution_intent.get("description", "")
        actions = execution_intent.get("actions", [])
        actions_block = "\n".join(f"- {action}" for action in actions)
        return f"{description}\n\nRecommended actions:\n{actions_block}"

    def _parse_dt(self, timestamp: str | None) -> datetime:
        if not timestamp:
            return datetime.utcnow()
        cleaned = timestamp.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(cleaned)
        except ValueError:
            return datetime.utcnow()
