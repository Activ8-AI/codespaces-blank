#!/usr/bin/env node
// managed-by: activ8-ai-context-pack | pack-version: 1.2.0
// source-sha: bff7ed8
/**
 * lint-alias-drift.mjs
 * Fail closed on stale MCP naming/alias drift in active repo surfaces.
 *
 * Scope intentionally excludes archival/evidence/history surfaces where
 * old names and retired URLs may remain as historical proof.
 *
 * Usage:
 *   node scripts/lint-alias-drift.mjs
 *   node scripts/lint-alias-drift.mjs --json
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const FLAG_JSON = process.argv.slice(2).includes("--json");

const ACTIVE_PATH_PREFIXES = [
  ".github/",
  "config/",
  "docs/",
  "scripts/",
  "src/",
];

const ACTIVE_PATH_EXACT = new Set([
  "AGENTS.md",
  "CLAUDE.md",
  "DEPLOYMENT-QUICK-START.md",
  "DEPLOYMENT-STATUS.md",
  "RELEASES.md",
  "notion-diagnostics-ui/README.md",
  "package.json",
]);

const RULES = [
  {
    id: "A-NAMING-001",
    pattern: /\bActiv8 MCP\b/g,
    message:
      "Disallowed shorthand `Activ8 MCP` in active surfaces. Use `activ8-ai-unified-mcp-server` or an explicit system description.",
  },
  {
    id: "A-NAMING-002",
    pattern: /\bactiv8-unified-mcp-server\b/g,
    message:
      "Disallowed stale local-server variant `activ8-unified-mcp-server`. Use `activ8-ai-unified-mcp-server`.",
  },
  {
    id: "A-NAMING-003",
    pattern: /ypztir4lba/g,
    message:
      "Disallowed retired Cloud Run revision URL token `ypztir4lba` in active surfaces.",
  },
];

function getTrackedFiles() {
  const res = spawnSync("git", ["ls-files", "-z"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (res.status !== 0) {
    const msg = (res.stderr || "").trim() || "unknown git ls-files failure";
    throw new Error(`git ls-files failed: ${msg}`);
  }

  return (res.stdout || "")
    .split("\0")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isActivePath(relPath) {
  if (ACTIVE_PATH_EXACT.has(relPath)) return true;
  return ACTIVE_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

function getLineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function getLineText(text, lineNumber) {
  return text.split("\n")[lineNumber - 1] || "";
}

const violations = [];

for (const relPath of getTrackedFiles()) {
  if (!isActivePath(relPath)) continue;

  const absPath = resolve(REPO_ROOT, relPath);
  const text = readFileSync(absPath, "utf8");

  for (const rule of RULES) {
    for (const match of text.matchAll(rule.pattern)) {
      const index = match.index ?? 0;
      const line = getLineNumber(text, index);
      violations.push({
        rule: rule.id,
        path: relPath,
        line,
        excerpt: getLineText(text, line).trim(),
        message: rule.message,
      });
    }
  }
}

if (FLAG_JSON) {
  process.stdout.write(`${JSON.stringify(violations, null, 2)}\n`);
  process.exit(violations.length > 0 ? 1 : 0);
}

if (violations.length === 0) {
  process.stdout.write("ALIAS-DRIFT CLEAN\n");
  process.exit(0);
}

process.stdout.write(`ALIAS-DRIFT VIOLATIONS: ${violations.length}\n\n`);
for (const violation of violations) {
  process.stdout.write(`${violation.rule} ${violation.path}:${violation.line}\n`);
  process.stdout.write(`  ${violation.message}\n`);
  process.stdout.write(`  ${violation.excerpt}\n\n`);
}

process.exit(1);
