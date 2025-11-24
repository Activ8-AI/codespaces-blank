from __future__ import annotations

"""Portal synchronization logic for Client Intelligence Portal."""

from typing import Any, Dict


class NotionClient:
    """Lightweight stand-in for the actual Notion integration."""

    def insert_row(self, database: str, data: Dict[str, Any]) -> str:
        # In production this would call Notion API and return new row ID.
        return f"{database}-row"


class PortalSync:
    def __init__(self, notion: NotionClient, logger) -> None:
        self.notion = notion
        self.logger = logger

    def industry_radar(self, client_id: str, payload: Dict[str, Any]) -> str:
        row_id = self.notion.insert_row(
            database="client_industry_radar",
            data={
                "Client": client_id,
                "Source": payload["source"],
                "Headline": payload["headline"],
                "Sector": payload["sector"],
                "Impact Areas": payload["impact"],
                "Urgency": payload["urgency"],
                "Volatility": payload["volatility"],
                "Confidence": payload["confidence"],
                "Summary": payload["summary"],
                "Recommended Actions": payload["recommended_actions"],
                "Links": payload.get("links", []),
                "Timestamp": payload["timestamp"],
                "Event ID": payload["event_id"],
            },
        )
        self.logger.audit(
            event="portal_sync.industry_radar",
            client=client_id,
            event_id=payload["event_id"],
            notion_row_id=row_id,
        )
        return row_id
