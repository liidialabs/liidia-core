import { Injectable } from '@nestjs/common';

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
];

const COUNTRY_PROVIDERS: Record<string, string[]> = {
  KE: ['M-Pesa', 'Airtel Money'],
  NG: ['MTN', 'Airtel', '9Mobile', 'Glo'],
  GH: ['MTN', 'Vodafone', 'AirtelTigo'],
  TZ: ['M-Pesa', 'Tigo Pesa', 'Airtel Money'],
  UG: ['MTN', 'Airtel Money'],
  ZA: ['Vodacom', 'MTN', 'Cell C', 'Telkom'],
  RW: ['MTN', 'Airtel'],
  ET: ['M-Pesa', 'Safaricom'],
};

export const CRYPTO_PROVIDERS = [
  'MetaMask',
  'Phantom',
  'Solflare',
  'Backpack',
];

@Injectable()
export class CountriesService {
  getCountries(): CountryInfo[] {
    return COUNTRIES;
  }

  getProvidersForCountry(code: string): string[] {
    return COUNTRY_PROVIDERS[code] ?? [];
  }

  getCryptoProviders(): string[] {
    return CRYPTO_PROVIDERS;
  }
}
