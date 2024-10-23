const axios = require('axios');
const pptx2json = require('pptx2json');
const fs = require('fs');
const path = require('path');
const officeParser = require('officeparser');

async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(outputPath));
    writer.on('error', reject);
  });
}

async function extractTextFromPptx(filePath) {
  const text = await officeParser.parseOfficeAsync(filePath);
  return text;
}

export const getPptxText = async (url: string) => {
  try {
    const filePath = path.join(__dirname, 'temp.pptx');
    await downloadFile(url, filePath);

    const text = await extractTextFromPptx(filePath);
    console.log('Extracted Text:', text);

    return text;

    // Clean up
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error:', error);
  }
};
