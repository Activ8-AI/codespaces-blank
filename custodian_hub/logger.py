from __future__ import annotations

"""Custodian Hub logging utilities for Industry Mesh telemetry."""

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional


@dataclass
class CustodianLogger:
    """Structured logger that writes JSONL artifacts for governance."""

    root: Path = field(default_factory=lambda: Path("logs/industry_mesh"))

    def __post_init__(self) -> None:
        self.root.mkdir(parents=True, exist_ok=True)

    def log_ingest(self, event: Dict[str, Any], signer: str) -> None:
        event_ts = self._parse_dt(event.get("timestamp"))
        payload = {
            "log_type": "industry_ingest",
            "event_id": event.get("event_id"),
            "source": event.get("source"),
            "hash": f"sha256:{self._hash(event)}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "provenance": event.get("links", []),
            "signer": signer,
        }
        self._write(event_ts, payload)

    def log_reflex(
        self,
        event_id: str,
        reflex: str,
        clients: List[str],
    ) -> None:
        payload = {
            "log_type": "industry_reflex",
            "event_id": event_id,
            "reflex": reflex,
            "clients": clients,
            "execution_intents_count": len(clients),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._write(datetime.utcnow(), payload)

    def audit(self, **fields: Any) -> None:
        payload = {"timestamp": datetime.utcnow().isoformat() + "Z", **fields}
        self._write(datetime.utcnow(), payload)

    def _write(self, dt_obj: datetime, payload: Dict[str, Any]) -> None:
        folder = self.root / f"{dt_obj.year}" / f"{dt_obj.month:02d}" / f"{dt_obj.day:02d}"
        folder.mkdir(parents=True, exist_ok=True)
        file_path = folder / "events.jsonl"
        with file_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload) + "\n")

    @staticmethod
    def _hash(event: Dict[str, Any]) -> str:
        event_bytes = json.dumps(event, sort_keys=True).encode("utf-8")
        return hashlib.sha256(event_bytes).hexdigest()

    @staticmethod
    def _parse_dt(timestamp: Optional[str]) -> datetime:
        if not timestamp:
            return datetime.utcnow()
        cleaned = timestamp.replace("Z", "+00:00")
        try:
            return datetime.fromisoformat(cleaned)
        except ValueError:
            return datetime.utcnow()
