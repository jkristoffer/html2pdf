#!/usr/bin/env node
/**
 * Example: Programmatic usage of @jk27/html2pdf
 */

import { generatePdf } from './index.js';
import fs from 'fs';

// Example 1: Generate PDF from HTML string
console.log('Example 1: Generate PDF from HTML string');
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Hello from @jk27/html2pdf</h1>
  <p>This PDF was generated programmatically.</p>
</body>
</html>
`;

const pdfBuffer = await generatePdf({ content: html });
fs.writeFileSync('example1-output.pdf', pdfBuffer);
console.log('✅ Created: example1-output.pdf');

// Example 2: Generate PDF from file URL
console.log('\nExample 2: Generate PDF from file URL');
if (fs.existsSync('test/quotation.with-sample-css.html')) {
  const fileUrl = `file://${process.cwd()}/test/quotation.with-sample-css.html`;
  const pdfBuffer2 = await generatePdf({ url: fileUrl });
  fs.writeFileSync('example2-output.pdf', pdfBuffer2);
  console.log('✅ Created: example2-output.pdf');
}

// Example 3: Generate and write directly to file
console.log('\nExample 3: Generate and write directly to file');
await generatePdf({
  content: '<h1>Direct to file</h1><p>No intermediate buffer needed.</p>',
  outputPath: 'example3-output.pdf'
});
console.log('✅ Created: example3-output.pdf');

console.log('\nDone! Generated 3 example PDFs.');
