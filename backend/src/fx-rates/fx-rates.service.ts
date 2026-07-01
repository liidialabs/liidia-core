import { Injectable, BadRequestException } from '@nestjs/common';

const SUPPORTED = ['KES', 'NGN', 'GHS', 'TZS', 'UGX', 'ZAR', 'RWF', 'ETB'];
const API_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_TTL = 60 * 60 * 1000;

@Injectable()
export class FxRatesService {
  private cache: { data: Record<string, number>; timestamp: number } | null = null;

  async getRates(): Promise<Record<string, number>> {
    if (this.cache && Date.now() - this.cache.timestamp < CACHE_TTL) {
      return this.cache.data;
    }

    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new BadRequestException('Failed to fetch FX rates');
    }

    const json = await res.json();
    const filtered: Record<string, number> = {};

    for (const code of SUPPORTED) {
      if (json.rates?.[code] != null) {
        filtered[code] = json.rates[code];
      }
    }

    this.cache = { data: filtered, timestamp: Date.now() };
    return filtered;
  }
}
