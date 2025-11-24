from __future__ import annotations

"""Canonical client matrix for Industry Reflex routing."""

from typing import Dict, Any

CLIENT_MATRIX: Dict[str, Dict[str, Any]] = {
    "modern_office": {
        "teamwork_project_id": "TW-PROJ-001",
        "strategy_codex_page": "codex://clients/modern_office",
        "industry_weight": 0.87,
    },
    "discount_equipment": {
        "teamwork_project_id": "TW-PROJ-002",
        "strategy_codex_page": "codex://clients/discount_equipment",
        "industry_weight": 0.73,
    },
}


def get_client_matrix() -> Dict[str, Dict[str, Any]]:
    """Return a copy of the client matrix for safe downstream use."""

    return {key: value.copy() for key, value in CLIENT_MATRIX.items()}
