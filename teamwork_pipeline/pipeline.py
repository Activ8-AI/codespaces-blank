from __future__ import annotations

"""Teamwork MCP pipeline integration for execution intents."""

from typing import Any, Dict, List


class TeamworkClient:
    """Simplified Teamwork client placeholder."""

    def create_task(self, project_id: str, task_name: str, description: str, due: str | None, tags: List[str]) -> str:
        return f"{project_id}-task"

    def create_subtask(self, parent_id: str, task_name: str, project_id: str) -> str:
        return f"{parent_id}-sub"

    def create_sprint(self, project_id: str, name: str, tasks: List[str]) -> str:
        return f"{project_id}-sprint"


class TeamworkPipeline:
    def __init__(self, teamwork_client: TeamworkClient, client_matrix: Dict[str, Dict[str, Any]], writer, logger) -> None:
        self.teamwork = teamwork_client
        self.client_matrix = client_matrix
        self.writer = writer
        self.logger = logger

    def dispatch(self, execution_intent: Dict[str, Any]) -> str:
        client = execution_intent["client_id"]
        project_id = self.client_matrix[client]["teamwork_project_id"]

        task_id = self.teamwork.create_task(
            project_id=project_id,
            task_name=execution_intent["title"],
            description=self.writer.attach_brief(execution_intent),
            due=execution_intent.get("due_date"),
            tags=execution_intent["tags"],
        )

        for action in execution_intent["actions"]:
            self.teamwork.create_subtask(
                parent_id=task_id,
                task_name=action,
                project_id=project_id,
            )

        if execution_intent["urgency"] >= 4:
            self.teamwork.create_sprint(
                project_id=project_id,
                name=f"{client} – Industry Reflex Window – {execution_intent['due_date']}",
                tasks=[task_id],
            )

        self.logger.audit(
            event="teamwork_pipeline_dispatch",
            client=client,
            task_id=task_id,
            event_id=execution_intent["source_event"],
            reflex=execution_intent["reflex"],
            confidence=execution_intent["confidence"],
            due=execution_intent.get("due_date"),
        )

        return task_id
