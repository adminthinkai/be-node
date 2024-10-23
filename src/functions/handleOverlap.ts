const axios = require('axios');
const pdfParse = require('pdf-parse');

function extractOverlap(text, overlapSize) {
  const startOverlap = text.slice(0, overlapSize); // Beginning of the chunk
  const endOverlap = text.slice(-overlapSize); // End of the chunk
  return { startOverlap, endOverlap };
}

export const handleOverlap = (chunk1, chunk2, overlapSize) => {
  const { endOverlap: endChunk1 } = extractOverlap(chunk1, overlapSize);
  const { startOverlap: startChunk2 } = extractOverlap(chunk2, overlapSize);

  if (endChunk1 === startChunk2) {
    // Overlap is identical, return chunk1 without the overlap from chunk2
    return chunk1 + chunk2.slice(overlapSize);
  } else {
    // If the overlap is not identical, compare and manually handle
    // For simplicity, we'll choose the longer section as the final overlap
    return chunk1 + chunk2.slice(overlapSize); // You can customize this
  }
};

export const assembleChunks = (chunks, overlapSize) => {
  let finalText = chunks[0]; // Start with the first chunk

  for (let i = 1; i < chunks.length; i++) {
    finalText = handleOverlap(finalText, chunks[i], overlapSize);
  }

  return finalText;
};
