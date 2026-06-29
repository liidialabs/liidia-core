export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export interface VaultEntry {
  vaultId: number;
  symbol: string;
  name: string;
  decimals: number;
}

export const VAULT_MAP: Record<string, VaultEntry> = {
  'So11111111111111111111111111111111111111112': { vaultId: 83, symbol: 'SOL', name: 'Wrapped SOL', decimals: 9 },
};

export const VAULT_MAP_ARRAY = Object.entries(VAULT_MAP).map(([mint, entry]) => ({
  mint,
  ...entry,
}));
