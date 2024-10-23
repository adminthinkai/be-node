const axios = require('axios');
const pdfParse = require('pdf-parse');

export const splitTextIntoChunks = (text, chunkSize, overlap) => {
  const chunks = [];
  let start = 0;
  const textLength = text.length;

  while (start < textLength) {
    let end = Math.min(start + chunkSize, textLength);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap; // Sliding window
  }

  return chunks;
};
