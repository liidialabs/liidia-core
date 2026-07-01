const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Recipient {
  id: string;
  walletAddress: string;
  type: 'mobile' | 'crypto';
  phoneNumber: string | null;
  cryptoAddress: string | null;
  countryCode: string | null;
  provider: string;
  label: string | null;
  createdAt: string;
}

export interface CreateRecipientBody {
  walletAddress: string;
  type: 'mobile' | 'crypto';
  phoneNumber?: string;
  cryptoAddress?: string;
  countryCode?: string;
  provider: string;
  label?: string;
}

const FALLBACK_COUNTRIES: Country[] = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
];

const FALLBACK_COUNTRY_PROVIDERS: Record<string, string[]> = {
  KE: ['M-Pesa', 'Airtel Money'],
  NG: ['MTN', 'Airtel', '9Mobile', 'Glo'],
  GH: ['MTN', 'Vodafone', 'AirtelTigo'],
  TZ: ['M-Pesa', 'Tigo Pesa', 'Airtel Money'],
  UG: ['MTN', 'Airtel Money'],
  ZA: ['Vodacom', 'MTN', 'Cell C', 'Telkom'],
  RW: ['MTN', 'Airtel'],
  ET: ['M-Pesa', 'Safaricom'],
};

async function tryFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export async function getCountries(): Promise<Country[]> {
  return tryFetch<Country[]>('/countries', FALLBACK_COUNTRIES);
}

export async function getCountryProviders(code: string): Promise<string[]> {
  return tryFetch<string[]>(
    `/countries/${code}/providers`,
    FALLBACK_COUNTRY_PROVIDERS[code] ?? [],
  );
}

export async function getRecipients(wallet: string): Promise<Recipient[]> {
  return tryFetch<Recipient[]>(
    `/recipients?wallet=${encodeURIComponent(wallet)}`,
    [],
  );
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function createRecipient(body: CreateRecipientBody): Promise<Recipient> {
  return request<Recipient>('/recipients', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateRecipient(id: string, body: Partial<CreateRecipientBody>): Promise<Recipient> {
  return request<Recipient>(`/recipients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteRecipient(id: string): Promise<void> {
  await request(`/recipients/${id}`, { method: 'DELETE' });
}

// ─── Borrow tokens ─────────────────────────────────────
export interface BorrowToken {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  image: string;
}

export const BORROW_TOKENS: BorrowToken[] = [
  { symbol: 'USDC', name: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6, image: "./usdc.png" },
  { symbol: 'USDT', name: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6, image: "./usdt.png"  },
  { symbol: 'USDS', name: 'USDS', mint: 'USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA', decimals: 6, image: "./usds.png"  },
  { symbol: 'USDG', name: 'USDG', mint: '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH', decimals: 6, image: "./usdg.png"  },
];

export interface Reserves {
  reserve: string;
  symbol: string;
  liquidityTokenMint: string;
  decimals: number;
}

export const BORROW_ASSETS: Record<string, Reserves> = {
  "USDC" : {
    reserve: "D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ59",
    symbol: "USDC",
    liquidityTokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6
  },
  "USDT" : {
    reserve: "H3t6qZ1JkguCNTi9uzVKqQ7dvt2cum4XiXWom6Gn5e5S",
    symbol: "USDT",
    liquidityTokenMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    decimals: 6
  },
  "USDS" : {
    reserve: "BHUi32TrEsfN2U821G4FprKrR4hTeK4LCWtA3BFetuqA",
    symbol: "USDS",
    liquidityTokenMint: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
    decimals: 6
  },
  "USDG" : {
    reserve: "ESCkPWKHmgNE7Msf77n9yzqJd5kQVWWGy3o5Mgxhvavp",
    symbol: "USDG",
    liquidityTokenMint: "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH",
    decimals: 6
  },
}

// ─── Kamino ─────────────────────────────────────────────
export const KAMINO_MARKET = '7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF';

export interface KaminoObligationReserve {
  reserve: string;
  deposited: string;
  borrowed: string;
  mint: string;
  symbol: string;
}

export interface KaminoObligation {
  obligation: string;
  reserves: KaminoObligationReserve[];
  healthFactor: number;
  collateralValue: number;
  borrowValue: number;
  maxBorrowable?: number;
}

export async function getKaminoObligations(wallet: string): Promise<KaminoObligation[]> {
  return tryFetch<KaminoObligation[]>(
    `/kamino/obligations/${KAMINO_MARKET}/${encodeURIComponent(wallet)}`,
    [],
  );
}

export async function getKaminoRates(): Promise<Record<string, { borrowApy: number }>> {
  return request('/kamino/rates');
}

export async function getFxRates(): Promise<Record<string, number> | null> {
  return tryFetch('/fx-rates', null);
}

export async function kaminoBorrow(wallet: string, supplyMint: string, amount: string): Promise<{ transaction: string }> {
  return request('/kamino/borrow/borrow', {
    method: 'POST',
    body: JSON.stringify({ wallet, supplyMint, amount }),
  });
}

export async function kaminoRepay(wallet: string, supplyMint: string, amount: string): Promise<{ transaction: string }> {
  return request('/kamino/borrow/repay', {
    method: 'POST',
    body: JSON.stringify({ wallet, supplyMint, amount }),
  });
}


