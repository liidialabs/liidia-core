import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { kaminoConfig } from '../config/configuration';
import { KAMINO_MARKET } from './reserves.config';
import { BORROW_ASSETS_BY_RESERVE } from './kamino-resolver.service';

export interface KaminoApiResponse {
  transaction: string;
}

interface KaminoApiError {
  statusCode: number;
  message: string;
  code?: string;
}

export interface RatesResponse {
  [symbol: string]: { borrowApy: number };
}

@Injectable()
export class KaminoService {
  private readonly apiBase: string;
  private ratesCache: { data: RatesResponse; timestamp: number } | null = null;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000;

  constructor(
    @Inject(kaminoConfig.KEY)
    private readonly config: ConfigType<typeof kaminoConfig>,
  ) {
    this.apiBase = this.config.apiBaseUrl;
  }

  private async postToKamino<T>(path: string, body: Record<string, string>): Promise<T> {
    const res = await fetch(`${this.apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const err = data as KaminoApiError;
      throw new BadRequestException({
        statusCode: err.statusCode || res.status,
        message: err.message || 'Kamino API error',
        code: err.code,
      });
    }

    return data as T;
  }

  private async getFromKamino<T>(path: string): Promise<T> {
    const res = await fetch(`${this.apiBase}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      const err = data as KaminoApiError;
      throw new BadRequestException({
        statusCode: err.statusCode || res.status,
        message: err.message || 'Kamino API error',
        code: err.code,
      });
    }

    return data as T;
  }

  async buildBorrow(wallet: string, market: string, reserve: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/klend/borrow', { wallet, market, reserve, amount });
  }

  async buildRepay(wallet: string, market: string, reserve: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/klend/repay', { wallet, market, reserve, amount });
  }

  async getMarket(address: string): Promise<unknown> {
    return this.getFromKamino(`/v2/kamino-market/${address}`);
  }

  async getUserObligations(market: string, user: string): Promise<unknown> {
    return this.getFromKamino(`/kamino-market/${market}/users/${user}/obligations`);
  }

  async getReserveMetrics(market: string): Promise<unknown> {
    return this.getFromKamino(`/kamino-market/${market}/reserves/metrics`);
  }

  async getBorrowRates(): Promise<RatesResponse> {
    if (this.ratesCache && Date.now() - this.ratesCache.timestamp < this.CACHE_TTL_MS) {
      return this.ratesCache.data;
    }

    const metrics = await this.getReserveMetrics(KAMINO_MARKET) as any[];
    const rates: RatesResponse = {};

    for (const item of metrics) {
      const entry = BORROW_ASSETS_BY_RESERVE[item.reserve as string];
      if (entry) {
        rates[entry.symbol] = { borrowApy: item.borrowApy };
      }
    }

    this.ratesCache = { data: rates, timestamp: Date.now() };
    return rates;
  }
}
