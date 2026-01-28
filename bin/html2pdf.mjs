#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { generatePdf } from "../lib/pdf.js";

const args = process.argv.slice(2);

// Helper to read stdin
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

(async () => {
  try {
    let inputContent = null;
    let inputUrl = null;
    let outputPath = undefined;

    // Detect Input
    if (args.length > 0 && args[0] !== '-') {
      // File argument provided
      const inputPath = args[0];
      const absInputPath = path.resolve(process.cwd(), inputPath);
      if (!fs.existsSync(absInputPath)) {
        console.error(`Input file not found: ${absInputPath}`);
        process.exit(1);
      }
      inputUrl = url.pathToFileURL(absInputPath).href;
    } else {
      // No arg or '-', read from stdin
      inputContent = await readStdin();
      if (!inputContent) {
        console.error("Usage: html2pdf <input.html> <output.pdf>");
        console.error("       cat input.html | html2pdf > output.pdf");
        process.exit(1);
      }
    }

    // Detect Output
    if (args.length > 1) {
      outputPath = path.resolve(process.cwd(), args[1]);
    }
    // If outputPath is undefined, generatePdf returns a Buffer (which we write to stdout)

    const result = await generatePdf({
      content: inputContent,
      url: inputUrl,
      outputPath: outputPath
    });

    if (!outputPath && result) {
      // Write Buffer to stdout
      process.stdout.write(result);
    } else if (outputPath) {
      console.log(`PDF created: ${outputPath}`);
    }

  } catch (err) {
    console.error("Error generating PDF:", err);
    process.exit(1);
  }
})();