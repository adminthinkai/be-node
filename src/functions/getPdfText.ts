const axios = require('axios');
const pdfParse = require('pdf-parse');

export const getPdfText = async (url: string) => {
  try {
    // Fetch the PDF file from the URL
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Parse the PDF buffer
    const data = await pdfParse(response.data);

    // Output the text content
    return data.text;
  } catch (error) {
    console.error('Error reading PDF:', error);
  }
};
