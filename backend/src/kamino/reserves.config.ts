export const KAMINO_MARKET = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';

export interface EarnVaultEntry {
  kvault: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface BorrowCollateralEntry {
  reserve: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export const EARN_VAULTS: Record<string, EarnVaultEntry> = {
  [USDC_MINT]: { kvault: 'TODO', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
};

export const BORROW_COLLATERALS: Record<string, BorrowCollateralEntry> = {
  'So11111111111111111111111111111111111111112': { reserve: 'TODO', symbol: 'SOL', name: 'Wrapped SOL', decimals: 9 },
};

export const USDC_RESERVE = 'TODO';

export const EARN_VAULTS_ARRAY = Object.entries(EARN_VAULTS).map(([mint, entry]) => ({ mint, ...entry }));

export const BORROW_COLLATERALS_ARRAY = Object.entries(BORROW_COLLATERALS).map(([mint, entry]) => ({ mint, ...entry }));
