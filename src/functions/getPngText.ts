import { createWorker } from 'tesseract.js';

export const getPngText = async (url: string) => {
  const worker: any = await createWorker();

  await worker.load();

  await worker.loadLanguage('eng');

  await worker.initialize('eng');

  const {
    data: { text },
  } = await worker.recognize(url);

  await worker.terminate();

  return text;
};
