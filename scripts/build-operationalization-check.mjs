#!/usr/bin/env node
// managed-by: activ8-ai-context-pack | pack-version: 1.2.0
// source-sha: bfdd4b8

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(REPO_ROOT, "artifacts", "build-operationalization");

function nowCtParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function timestampCt() {
  const p = nowCtParts();
  return `${p.year}${p.month}${p.day}_${p.hour}${p.minute}${p.second}_CT`;
}

function labelCt() {
  const p = nowCtParts();
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} CT`;
}

function readText(relativePath) {
  try {
    return readFileSync(join(REPO_ROOT, relativePath), "utf-8");
  } catch {
    return null;
  }
}

function hasPackageScript(pkg, name, needle) {
  const value = pkg?.scripts?.[name];
  return typeof value === "string" && value.includes(needle);
}

const requiredFiles = [
  ".github/ai-agent-policy.md",
  ".github/copilot-instructions.md",
  ".github/agents/cursor.md",
  ".github/agents/chatgpt.md",
  ".github/agents/claude-cowork.md",
  ".github/agents/genesis.md",
  ".github/agents/gemini.md",
  "AGENTS.md",
  "CLAUDE.md",
  "docs/AUDIENCE-SURFACE-CONTRACT.md",
  "docs/SOURCES-OF-TRUTH.md",
  ".github/workflows/build-operationalization.yml",
  "scripts/build-operationalization-check.mjs",
  "scripts/operationalize-buildwide.mjs",
  "scripts/action-persistence-self-check.mjs",
  "scripts/query-source-ladder.mjs",
  "scripts/session-boot.mjs",
  "scripts/lib/action-persistence.mjs",
  "artifacts/prompt-library/README.md",
  "artifacts/prompt-library/OBVIOUS-ANSWER-QUESTION-ELIMINATION-RULE.md",
  "artifacts/prompt-library/STOP-RESET-REALIGN-ANTI-AVOIDANCE-PROMPTS.md",
  "artifacts/prompt-library/AGENT-ANNOUNCEMENT-SRR-ANTI-AVOIDANCE-v1.md",
];

const blockers = [];
const checks = [];

for (const relativePath of requiredFiles) {
  const ok = existsSync(join(REPO_ROOT, relativePath));
  checks.push({ name: relativePath, ok });
  if (!ok) {
    blockers.push(`Missing required file: ${relativePath}`);
  }
}

let pkg = null;
try {
  pkg = JSON.parse(readText("package.json") || "{}");
} catch {
  blockers.push("Invalid package.json");
}

const packageChecks = [
  {
    name: "operationalize:build",
    ok: hasPackageScript(pkg, "operationalize:build", "scripts/build-operationalization-check.mjs"),
  },
  {
    name: "operationalize:repo",
    ok: hasPackageScript(pkg, "operationalize:repo", "scripts/operationalize-buildwide.mjs"),
  },
  {
    name: "action-persistence:check",
    ok: hasPackageScript(pkg, "action-persistence:check", "scripts/action-persistence-self-check.mjs"),
  },
  {
    name: "query:source-ladder",
    ok: hasPackageScript(pkg, "query:source-ladder", "scripts/query-source-ladder.mjs"),
  },
  {
    name: "session:boot",
    ok: hasPackageScript(pkg, "session:boot", "scripts/session-boot.mjs"),
  },
];

if (pkg?.scripts?.preflight) {
  packageChecks.push({
    name: "preflight hook",
    ok: hasPackageScript(pkg, "preflight", "npm run operationalize:repo -- --dry-run"),
  });
}

if (pkg?.scripts?.["session:finish"]) {
  packageChecks.push({
    name: "session:finish hook",
    ok: hasPackageScript(pkg, "session:finish", "npm run operationalize:repo -- --with-sync"),
  });
}

for (const check of packageChecks) {
  checks.push(check);
  if (!check.ok) {
    blockers.push(`Package script missing contract: ${check.name}`);
  }
}

const markerChecks = [
  {
    name: "docs/AUDIENCE-SURFACE-CONTRACT.md audience marker",
    ok: (readText("docs/AUDIENCE-SURFACE-CONTRACT.md") || "").includes("Audience Contract"),
  },
  {
    name: "docs/AUDIENCE-SURFACE-CONTRACT.md trace marker",
    ok: (readText("docs/AUDIENCE-SURFACE-CONTRACT.md") || "").includes("Trace Rule"),
  },
  {
    name: "docs/SOURCES-OF-TRUTH.md contract marker",
    ok: (readText("docs/SOURCES-OF-TRUTH.md") || "").includes("docs/AUDIENCE-SURFACE-CONTRACT.md"),
  },
  {
    name: "docs/SOURCES-OF-TRUTH.md query ladder marker",
    ok: (readText("docs/SOURCES-OF-TRUTH.md") || "").includes("## Query Ladder"),
  },
  {
    name: "docs/SOURCES-OF-TRUTH.md automatic bootstrap marker",
    ok: (readText("docs/SOURCES-OF-TRUTH.md") || "").includes("Automatic session/bootstrap binding"),
  },
  {
    name: ".github/ai-agent-policy.md obvious-answer marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Obvious-Answer Question Elimination Rule"),
  },
  {
    name: ".github/ai-agent-policy.md canonical control-plane marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Canonical Control-Plane Order"),
  },
  {
    name: ".github/ai-agent-policy.md seek-first planning marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Seek-First Planning Gate"),
  },
  {
    name: ".github/ai-agent-policy.md prompt-library adaptation marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Prompt Library Adaptation"),
  },
  {
    name: ".github/ai-agent-policy.md audience contract marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Audience + Surface Contract"),
  },
  {
    name: ".github/ai-agent-policy.md operationalize marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("operationalize:repo"),
  },
  {
    name: ".github/ai-agent-policy.md bootstrap marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Automatic Source Bootstrap"),
  },
  {
    name: "AGENTS.md obvious-answer marker",
    ok: (readText("AGENTS.md") || "").includes("Obvious-Answer Question Elimination Rule"),
  },
  {
    name: "AGENTS.md seek-first planning marker",
    ok: (readText("AGENTS.md") || "").includes("Seek-First Planning Gate"),
  },
  {
    name: "AGENTS.md audience contract marker",
    ok: (readText("AGENTS.md") || "").includes("docs/AUDIENCE-SURFACE-CONTRACT.md"),
  },
  {
    name: "AGENTS.md bootstrap marker",
    ok: (readText("AGENTS.md") || "").includes("Automatic Source Bootstrap"),
  },
  {
    name: ".github/agents/cursor.md obvious-answer marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Obvious-Answer Question Elimination Rule"),
  },
  {
    name: ".github/agents/cursor.md seek-first planning marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Seek-First Planning Gate"),
  },
  {
    name: ".github/agents/cursor.md audience contract marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("docs/AUDIENCE-SURFACE-CONTRACT.md"),
  },
  {
    name: ".github/agents/cursor.md bootstrap marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Automatic Source Bootstrap"),
  },
  {
    name: "scripts/session-boot.mjs query ladder binding",
    ok: (readText("scripts/session-boot.mjs") || "").includes("runSourceQueryLadder") &&
      (readText("scripts/session-boot.mjs") || "").includes("## Source Bootstrap"),
  },
  {
    name: "scripts/query-source-ladder.mjs receipt ledger marker",
    ok: (readText("scripts/query-source-ladder.mjs") || "").includes("query-receipts.jsonl") &&
      (readText("scripts/query-source-ladder.mjs") || "").includes("runSourceQueryLadder"),
  },
];

const persistentScopeMarkers = [
  "Seek First to Understand",
  "Verify what exists in Notion",
  "Search for existing artifacts",
  "Build on established work",
  "Create new only when necessary",
  "Fail closed on deviation",
];

for (const [filePath, label] of [
  [".github/ai-agent-policy.md", "master policy"],
  [".github/copilot-instructions.md", "copilot"],
  ["AGENTS.md", "codex"],
  ["CLAUDE.md", "claude"],
  [".github/agents/cursor.md", "cursor"],
  [".github/agents/chatgpt.md", "chatgpt"],
  [".github/agents/claude-cowork.md", "claude-cowork"],
  [".github/agents/genesis.md", "genesis"],
  [".github/agents/gemini.md", "gemini"],
]) {
  const content = readText(filePath) || "";
  for (const marker of persistentScopeMarkers) {
    markerChecks.push({
      name: `${label} persistent scope marker ${marker}`,
      ok: content.includes(marker),
    });
  }
}

for (const check of markerChecks) {
  checks.push(check);
  if (!check.ok) {
    blockers.push(`Missing required marker: ${check.name}`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const ts = timestampCt();
const status = blockers.length === 0 ? "GREEN" : "RED";
const payload = {
  schema_version: "managed_repo_build_operationalization_v1",
  status,
  timestamp_ct: ts,
  generated_at_ct: labelCt(),
  blockers,
  checks,
};

const jsonPath = join(OUTPUT_DIR, `${ts}__build_operationalization.json`);
const mdPath = join(OUTPUT_DIR, `${ts}__build_operationalization.md`);
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
writeFileSync(
  mdPath,
  `# Build Operationalization\n\n- Status: ${status}\n- Generated: ${payload.generated_at_ct}\n- Blockers: ${blockers.length}\n`,
  "utf-8"
);

process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
if (status !== "GREEN") {
  process.exit(1);
}
