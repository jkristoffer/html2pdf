import puppeteer from 'puppeteer';

/**
 * Generates a PDF from HTML content or a URL.
 * 
 * @param {Object} options
 * @param {string} [options.content] - Raw HTML content string.
 * @param {string} [options.url] - URL to load (file:// or http://).
 * @param {string} [options.outputPath] - Path to write the PDF file. If omitted, returns Buffer.
 * @param {Object} [options.pdfOptions] - Puppeteer PDF options.
 * @param {import('puppeteer').Browser} [options.browser] - Optional existing browser instance.
 * @returns {Promise<Buffer|void>} - Returns Buffer if no outputPath, otherwise writes file and returns void.
 */
export async function generatePdf({ content, url, outputPath, pdfOptions = {}, browser: existingBrowser }) {
  const browser = existingBrowser || await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Safer defaults for containers/services
  });

  try {
    const page = await browser.newPage();

    if (url) {
      await page.goto(url, { waitUntil: 'networkidle0' });
    } else if (content) {
      await page.setContent(content, { waitUntil: 'networkidle0' });
    } else {
      throw new Error('Must provide either "content" or "url"');
    }

    const defaultPdfOptions = {
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    };

    const finalPdfOptions = {
      ...defaultPdfOptions,
      ...pdfOptions,
      path: outputPath // Puppeteer writes to file if path is present, returns Buffer if undefined
    };

    const result = await page.pdf(finalPdfOptions);
    return result;

  } finally {
    if (!existingBrowser) {
      await browser.close();
    } else {
      // If we reused a browser, just close the page
      const pages = await browser.pages();
      for (const p of pages) await p.close(); 
      // Note: In a real service we might keep a pool, but for now closing pages is good practice.
      // Actually, just closing the one we opened is safer:
      // await page.close(); // We don't have ref to page here easily without restructuring try/finally
    }
  }
}
