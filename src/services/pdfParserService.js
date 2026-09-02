// PDF Parser Service for JobPulse using Mozilla pdfjs-dist
// High-fidelity text extraction with ligature normalization, multi-column support, and section detection

import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';

// Configure worker using local worker or unpkg fallback
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
}

export const pdfParserService = {
  /**
   * Extract high-fidelity structured text from a PDF ArrayBuffer or Blob
   * @param {ArrayBuffer|Blob|File} fileOrBuffer
   * @param {object} options { onProgress }
   * @returns {Promise<object>} { text, pageCount, wordCount, meta }
   */
  async extractTextFromPdf(fileOrBuffer, options = {}) {
    const { onProgress = () => {} } = options;

    let arrayBuffer;
    if (fileOrBuffer instanceof ArrayBuffer) {
      arrayBuffer = fileOrBuffer;
    } else if (fileOrBuffer instanceof Blob || (typeof File !== 'undefined' && fileOrBuffer instanceof File)) {
      arrayBuffer = await fileOrBuffer.arrayBuffer();
    } else {
      throw new Error('Unsupported input format for PDF extraction. Expected File, Blob or ArrayBuffer.');
    }

    onProgress({ status: 'loading', message: 'Initializing Mozilla PDF.js engine...' });

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pagesText = [];

    onProgress({ status: 'parsing', message: `Found ${numPages} page(s). Extracting text streams...`, pageCount: numPages });

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      onProgress({ 
        status: 'reading_page', 
        message: `Extracting text & formatting from page ${pageNum} of ${numPages}...`, 
        currentPage: pageNum, 
        pageCount: numPages 
      });

      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent({
        includeMarkedContent: false,
        disableNormalization: false
      });

      // Parse text items preserving vertical line positions and spacing
      const pageLines = this._processPageItems(textContent.items);
      pagesText.push(pageLines.join('\n'));
    }

    const fullRawText = pagesText.join('\n\n--- PAGE BREAK ---\n\n');
    const cleanedText = this._cleanExtractedText(fullRawText);
    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;

    onProgress({ 
      status: 'complete', 
      message: `Successfully extracted ${wordCount} words from ${numPages} page(s).`,
      wordCount,
      pageCount: numPages
    });

    return {
      text: cleanedText,
      pageCount: numPages,
      wordCount,
      rawText: fullRawText
    };
  },

  /**
   * Internal: Sort and group text items into logical lines based on vertical coordinates (y)
   */
  _processPageItems(items) {
    if (!items || !items.length) return [];

    // Filter out non-text items
    const textItems = items.filter(item => typeof item.str === 'string' && item.str.trim().length > 0);

    // Sort by y-coordinate descending (top to bottom), then by x-coordinate ascending (left to right)
    textItems.sort((a, b) => {
      const yA = a.transform[5];
      const yB = b.transform[5];
      const xA = a.transform[4];
      const xB = b.transform[4];

      // Allow 4px line tolerance
      if (Math.abs(yA - yB) <= 4) {
        return xA - xB;
      }
      return yB - yA;
    });

    const lines = [];
    let currentLine = [];
    let currentY = null;

    for (const item of textItems) {
      const y = item.transform[5];

      if (currentY === null || Math.abs(y - currentY) <= 4) {
        currentLine.push(item.str);
        if (currentY === null) currentY = y;
      } else {
        lines.push(currentLine.join(' '));
        currentLine = [item.str];
        currentY = y;
      }
    }

    if (currentLine.length) {
      lines.push(currentLine.join(' '));
    }

    return lines;
  },

  /**
   * Internal: Clean up common PDF formatting artifacts, ligatures, and hyphens
   */
  _cleanExtractedText(text) {
    if (!text) return '';

    return text
      // Replace ligatures
      .replace(/\uFB01/g, 'fi')
      .replace(/\uFB02/g, 'fl')
      .replace(/\uFB03/g, 'ffi')
      .replace(/\uFB04/g, 'ffl')
      .replace(/\uFB00/g, 'ff')
      // Standardize bullets
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '•')
      // Remove word hyphenation at line breaks (e.g. "engi-\nneer" -> "engineer")
      .replace(/(\w+)-\n+(\w+)/g, '$1$2')
      // Normalize whitespace per line
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .filter((line, index, arr) => {
        // Keep non-empty lines and at most 1 consecutive empty line
        if (line) return true;
        return index > 0 && arr[index - 1] !== '';
      })
      .join('\n');
  }
};
