// managed-by: activ8-ai-context-pack | pack-version: 1.1.0
// source-sha: bff7ed8
export interface PersistedActionReceipt {
  schema_version: "action_persistence_v1";
  action_id: string;
  action_class: string;
  entrypoint: string;
  status: string;
  request_id: string | null;
  timestamp_ct: string;
  generated_at_ct: string;
  generated_at_utc: string;
  started_at_utc: string;
  finished_at_utc: string;
  duration_ms: number;
  evidence: Record<string, unknown>;
  artifacts: Record<string, unknown>;
  metadata: Record<string, unknown>;
  error: {
    message: string;
    code: string | null;
  } | null;
}

export function persistActionReceipt(params: {
  repoRoot?: string;
  actionId: string;
  actionClass?: string;
  entrypoint: string;
  status: string;
  startedAtMs?: number;
  finishedAtMs?: number;
  requestId?: string;
  evidence?: Record<string, unknown>;
  artifacts?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  error?: { message?: string; code?: string | null } | null;
}): PersistedActionReceipt & {
  persistence: {
    timestamped_path: string;
    latest_path: string;
    ledger_path: string;
    previous_latest: unknown;
  };
};

export function safePersistActionReceipt(params: {
  repoRoot?: string;
  actionId: string;
  actionClass?: string;
  entrypoint: string;
  status: string;
  startedAtMs?: number;
  finishedAtMs?: number;
  requestId?: string;
  evidence?: Record<string, unknown>;
  artifacts?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  error?: { message?: string; code?: string | null } | null;
}):
  | (PersistedActionReceipt & {
      persistence: {
        timestamped_path: string;
        latest_path: string;
        ledger_path: string;
        previous_latest: unknown;
      };
    })
  | null;
