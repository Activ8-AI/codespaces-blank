from __future__ import annotations

"""Codex bindings for systems encyclopedia and client strategy layers."""

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List


class CodexBinding:
    def __init__(self, base_path: Path | None = None) -> None:
        self.base_path = base_path or Path("codex/logs")
        self.base_path.mkdir(parents=True, exist_ok=True)

    def record_system_events(self, system_refs: Iterable[str], event: Dict[str, Any]) -> None:
        for system_ref in system_refs:
            payload = {
                "layer": "systems",
                "system": system_ref,
                "event_type": "industry_signal",
                "source": event.get("source"),
                "headline": event.get("headline"),
                "date": event.get("timestamp"),
                "impact": event.get("impact", []),
                "summary": event.get("headline"),
                "links": event.get("links", []),
                "timestamp": datetime.utcnow().isoformat() + "Z",
            }
            self._write("systems_timeline", payload)

    def record_client_event(self, client_id: str, intent: Dict[str, Any], reflex_score: float | None = None) -> None:
        payload = {
            "layer": "client_strategy",
            "client": client_id,
            "reflex": intent.get("reflex"),
            "signal": intent.get("title"),
            "sector": intent.get("sector", []),
            "actions": intent.get("actions", []),
            "urgency": intent.get("urgency"),
            "confidence": intent.get("confidence"),
            "source_event": intent.get("source_event"),
            "reflex_score": reflex_score,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._write("client_timeline", payload)

    def _write(self, name: str, payload: Dict[str, Any]) -> None:
        file_path = self.base_path / f"{name}.jsonl"
        with file_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload) + "\n")
