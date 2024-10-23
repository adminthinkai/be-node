import { config } from 'dotenv';

config();

export const getPort = () => {
  return process.env.PORT || 3000;
};
