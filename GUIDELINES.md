# Service Architecture Standards

This document defines the architectural standards for our service ecosystem. The goal is to build services that are **composable**, **testable**, and **deployment-agnostic**.

## Core Philosophy: "The Universal Core"

We follow a **Hexagonal Architecture** (also known as Ports & Adapters). The central principle is that **Business Logic** must be completely decoupled from **Delivery Mechanisms** (CLI, HTTP, Queue).

### 1. The Core Layer (Domain)
*   **Responsibility**: Pure business logic.
*   **Inputs**: Standard data types (Objects, Strings, Streams).
*   **Outputs**: Standard data types or Promises.
*   **Constraints**:
    *   **NO** direct dependency on `process.argv` or `process.exit`.
    *   **NO** direct dependency on HTTP frameworks (Express/Fastify objects).
    *   **NO** direct dependency on specific queue implementations (SQS/RabbitMQ events).
*   **Benefit**: This allows the same logic to be used in a CLI script, a Web Server, a Background Worker, or a Test Suite without modification.

### 2. The Interface Layer (Adapters)
These are thin wrappers that translate external inputs into calls to the Core Layer.

*   **CLI Adapter**: Translates `stdin`/`argv` → Core → `stdout`/`stderr`.
*   **HTTP Adapter**: Translates `Request` → Core → `Response`.
*   **Worker Adapter**: Translates `Job Payload` → Core → `Job Result`.

## The Unix Philosophy (Composability)

All services should natively support **Unix-style piping** where applicable. This allows complex workflows to be orchestrated via simple shell scripts before (or instead of) building complex orchestration systems.

*   **Standard Input (stdin)**: Services should default to reading data from stdin if no file argument is provided.
*   **Standard Output (stdout)**: Services should write their primary output (data) to stdout.
*   **Standard Error (stderr)**: Logs, progress bars, and errors must go to stderr so they don't corrupt the data pipe.

## Project Structure Template

A compliant service should look like this:

```text
project-root/
├── lib/          # THE CORE
│   └── logic.js  # Pure function: (input) => output
├── bin/          # CLI ADAPTER
│   └── cli.mjs   # Handles argv, stdin, stdout
├── server/       # HTTP ADAPTER (Optional)
│   └── api.js    # Handles req, res
└── test/         # VERIFICATION
```

## Decision Matrix

| Feature | Core (`lib/`) | CLI (`bin/`) | HTTP (`server/`) |
| :--- | :--- | :--- | :--- |
| **Business Logic** | ✅ **YES** | ❌ NO | ❌ NO |
| **File System I/O** | ⚠️ Minimal | ✅ YES | ⚠️ Minimal |
| **Argument Parsing** | ❌ NO | ✅ YES | ❌ NO |
| **HTTP Status Codes**| ❌ NO | ❌ NO | ✅ YES |
| **Logging** | ⚠️ Events/Hooks | ✅ Stderr | ✅ JSON/Stream |

## Summary

> **"Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface."**
> — *Doug McIlroy*
