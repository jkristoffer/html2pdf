# @jk27/html2pdf

Convert a local HTML file or string to a PDF using headless Chromium (Puppeteer). Simple CLI with sensible defaults for printable documents. Supports Unix-style piping.

## Requirements

- Node.js 18+ (ESM enabled)
- Puppeteer (installed via `npm install`) will download a compatible Chromium

## Install

### From Git (SSH)

```bash
npm i git+ssh://git@github.com:jkristoffer/html2pdf.git#v1.0.0
```

### Local / Development

- Clone and install dependencies:

```
npm install
```

- Install a managed Chrome for Puppeteer (required once):

```
npm run browsers:install
```

- Optional: link the binary for convenient `html2pdf` usage:

```
npm link
```

## Usage

### CLI

- **File to File**:

```bash
html2pdf <input.html> <output.pdf>
# Example
html2pdf test/quotation.with-sample-css.html out.pdf
```

- **Piping (Stdin/Stdout)**:

You can pipe HTML into `html2pdf` and redirect the output to a file.

```bash
# Read from stdin, write to file
echo "<h1>Hello World</h1>" | html2pdf > out.pdf

# Read from file, write to file (via redirection)
cat input.html | html2pdf > out.pdf
```

### Programmatic Usage (Node.js)

You can use the core library in your own Node.js applications.

```javascript
import { generatePdf } from '@jk27/html2pdf';

// Generate from HTML string
const pdfBuffer = await generatePdf({
  content: '<h1>Hello</h1>'
});

// Generate from URL (file:// or http://)
const pdfBuffer2 = await generatePdf({
  url: 'file:///absolute/path/to/file.html'
});

// Write directly to file
await generatePdf({
  content: '<h1>Hello</h1>',
  outputPath: '/path/to/out.pdf'
});
```

## Quick Test

- Run the built-in test to generate a sample PDF from the fixture:

```
npm test
```

- Output path: `test/out.pdf`
- Open the PDF and visually verify layout, fonts, margins, and backgrounds.

## What It Does

- Launches headless Chromium via Puppeteer
- Loads the HTML using a `file://` URL or `setContent`
- Exports an A4 PDF with background graphics and 10mm margins
- Prints a success path like: `PDF created: /absolute/path/out.pdf`

Defaults are set to:

- `format: "A4"`
- `printBackground: true`
- `margin: { top/right/bottom/left: "10mm" }`

## Tips for Reliable Output

- Keep CSS and assets inline (e.g., data URIs) for determinism
- Prefer print styles (e.g., `@media print`) for layout tweaks
- Avoid external fonts/assets when possible, or embed them
- Use absolute or data URLs for images when testing locally

## Development

- Structure:
  - `bin/` – CLI entry point (`html2pdf.mjs`)
  - `lib/` – Core PDF generation logic (`pdf.js`)
  - `test/` – manual fixtures (e.g., `quotation.with-sample-css.html`)
  - `package.json` – declares the `html2pdf` binary and dependencies

- Handy script:

```
npm run demo
```

- Test script:

```
npm test
```

## Security & Environment Notes

- Only process trusted local HTML files
- External resources can break determinism or introduce risks
- If you prefer a system Chrome instead of the managed one or Chromium download is blocked (firewall/air‑gapped):
  - Install with `PUPPETEER_SKIP_DOWNLOAD=1 npm install`
  - Then run with a system Chrome by setting `PUPPETEER_EXECUTABLE_PATH` to your Chrome path, or update `bin/html2pdf.mjs` to pass `executablePath` to `puppeteer.launch`.
    - macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
    - Linux: `/usr/bin/google-chrome` (or `/usr/bin/chromium`)
    - Windows: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`

## Troubleshooting

- “Input file not found”: ensure the path is correct; relative paths are resolved from the current working directory
- Blank or incomplete PDF: check that assets are accessible via `file://` or are inlined
- Installation issues on corporate networks: see the Chromium download note above
- “Please run: npx puppeteer browsers install chrome”: run `npm run browsers:install` once to download a compatible Chrome version

---

Feedback and improvements welcome. Validate changes by generating a PDF from the fixture and visually inspecting layout, fonts, margins, and backgrounds.
