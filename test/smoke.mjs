import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const binPath = path.join(repoRoot, "bin", "html2pdf.mjs");
const fixturePath = path.join(__dirname, "quotation.with-sample-css.html");

function assertPdfBuffer(buffer) {
  assert.ok(buffer.length > 1000, "PDF buffer is unexpectedly small");
  assert.equal(buffer.slice(0, 4).toString(), "%PDF", "Missing PDF header");
}

function assertPdfFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  assertPdfBuffer(buffer);
}

// Test 1: file input -> file output
{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "html2pdf-"));
  const outPath = path.join(tmpDir, "out.pdf");

  const result = spawnSync(process.execPath, [binPath, fixturePath, outPath], {
    stdio: "pipe",
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`CLI failed (file input): ${result.stderr || result.stdout}`);
  }

  assertPdfFile(outPath);
}

// Test 2: stdin -> stdout
{
  const html = fs.readFileSync(fixturePath, "utf8");
  const result = spawnSync(process.execPath, [binPath], {
    stdio: "pipe",
    input: html,
    maxBuffer: 10 * 1024 * 1024
  });

  if (result.status !== 0) {
    throw new Error(`CLI failed (stdin): ${result.stderr || result.stdout}`);
  }

  assertPdfBuffer(result.stdout);
}

console.log("Smoke tests passed: CLI file output and stdin/stdout paths generated valid PDFs.");
