import { registerAs } from '@nestjs/config';

export const kaminoConfig = registerAs('kamino', () => ({
  apiBaseUrl: process.env.KAMINO_API_BASE_URL || 'https://api.kamino.finance',
  marketAddress: process.env.KAMINO_MARKET_ADDRESS || '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF',
}));

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
}));

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'solana_bridge',
}));
