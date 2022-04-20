import dotenv from 'dotenv';

dotenv.config();

export const getEnvData = (envVariable: string) => process.env[envVariable];