import { registerAs } from '@nestjs/config';

export const kaminoConfig = registerAs('kamino', () => ({
  apiBaseUrl: process.env.KAMINO_API_BASE_URL || 'https://api.kamino.finance',
  marketAddress: process.env.KAMINO_MARKET_ADDRESS || '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF',
}));

export const jupiterConfig = registerAs('jupiter', () => ({
  rpcEndpoint: process.env.RPC_ENDPOINT || 'https://solana-mainnet.infura.io/v3/18f7267d6c1544ecad55744dd50b6185',
}));

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
}));
