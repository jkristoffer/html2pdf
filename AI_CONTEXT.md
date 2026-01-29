## CONTEXT_VERSION
1

## PROJECT
Convert HTML to PDF via a Node.js CLI and core library using headless Chromium.

## TECH_STACK_INTENT
- **Prefer:** Node.js 18+ (ESM), Puppeteer-managed Chromium, Unix-style piping, hexagonal architecture (core in lib, adapters in bin)
- **Avoid:** Tight coupling of core logic to CLI/HTTP/queue frameworks; writing logs to stdout
- **Why:** Core logic should be reusable across adapters and composable in Unix pipelines

### Exceptions
- <context: specific rule>

## NON-GOALS
- Provide an HTTP server or queue worker adapter
- Support non-Chromium PDF engines

## INVARIANTS
- Core logic lives in `lib/` and stays free of argv/stdin/stdout handling
- CLI adapter in `bin/` handles argv/stdin/stdout and writes logs to stderr
- Preserve Unix-style piping behavior (stdin/stdout)

## CONSTRAINTS
- **Runtime:** Node.js 18+
- **Version locks:** <none>
- **External APIs:** Puppeteer/Chromium

## ARCH_INTENT
- **Boundaries:** Hexagonal (Ports & Adapters): core in `lib/`, CLI adapter in `bin/`

## AI_RULES
- Minimal diffs
- Ask before adding dependencies
- Do not refactor unrelated code
- Follow existing patterns

## EXTENSIONS
<!-- Project-specific additions; informational unless referenced -->

## UNANSWERED
<!-- Ambiguities that would benefit from human clarification -->
- <question>
