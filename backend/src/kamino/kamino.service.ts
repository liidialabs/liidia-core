import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { kaminoConfig } from '../config/configuration';

export interface KaminoApiResponse {
  transaction: string;
}

interface KaminoApiError {
  statusCode: number;
  message: string;
  code?: string;
}

@Injectable()
export class KaminoService {
  private readonly apiBase: string;

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

  async buildEarnDeposit(wallet: string, kvault: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/kvault/deposit', { wallet, kvault, amount });
  }

  async buildEarnWithdraw(wallet: string, kvault: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/kvault/withdraw', { wallet, kvault, amount });
  }

  async buildBorrowDeposit(wallet: string, market: string, reserve: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/klend/deposit', { wallet, market, reserve, amount });
  }

  async buildBorrow(wallet: string, market: string, reserve: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/klend/borrow', { wallet, market, reserve, amount });
  }

  async buildRepay(wallet: string, market: string, reserve: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/klend/repay', { wallet, market, reserve, amount });
  }

  async buildWithdraw(wallet: string, market: string, reserve: string, amount: string): Promise<KaminoApiResponse> {
    return this.postToKamino('/ktx/klend/withdraw', { wallet, market, reserve, amount });
  }

  async getMarket(address: string): Promise<unknown> {
    return this.getFromKamino(`/v2/kamino-market/${address}`);
  }

  async getUserObligations(market: string, user: string): Promise<unknown> {
    return this.getFromKamino(`/kamino-market/${market}/users/${user}/obligations`);
  }

  async getEarnVaults(): Promise<unknown> {
    return this.getFromKamino('/kvaults/vaults');
  }

  async getUserVaultPositions(wallet: string): Promise<unknown> {
    return this.getFromKamino(`/kvaults/users/${wallet}/positions`);
  }

  async getReserveMetrics(market: string): Promise<unknown> {
    return this.getFromKamino(`/kamino-market/${market}/reserves/metrics`);
  }
}
