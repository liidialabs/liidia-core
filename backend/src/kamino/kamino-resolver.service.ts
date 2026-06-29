import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  EARN_VAULTS,
  EARN_VAULTS_ARRAY,
  BORROW_COLLATERALS,
  BORROW_COLLATERALS_ARRAY,
  USDC_RESERVE,
  KAMINO_MARKET,
} from './reserves.config';

export interface DepositToken {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
}

@Injectable()
export class KaminoResolverService {
  private readonly logger = new Logger(KaminoResolverService.name);

  getEarnDepositTokens(): DepositToken[] {
    return EARN_VAULTS_ARRAY.map((v) => ({
      mint: v.mint,
      symbol: v.symbol,
      name: v.name,
      decimals: v.decimals,
    }));
  }

  getBorrowCollateralTokens(): DepositToken[] {
    return BORROW_COLLATERALS_ARRAY.map((v) => ({
      mint: v.mint,
      symbol: v.symbol,
      name: v.name,
      decimals: v.decimals,
    }));
  }

  resolveEarnVault(supplyMint: string): string {
    const entry = EARN_VAULTS[supplyMint];
    if (!entry) {
      const available = EARN_VAULTS_ARRAY.map((v) => v.symbol);
      throw new NotFoundException(
        `No earn vault for mint ${supplyMint}. Available: ${available.join(', ') || 'none'}`,
      );
    }
    return entry.kvault;
  }

  resolveCollateralReserve(supplyMint: string): { reserve: string; market: string } {
    const entry = BORROW_COLLATERALS[supplyMint];
    if (!entry) {
      const available = BORROW_COLLATERALS_ARRAY.map((v) => v.symbol);
      throw new NotFoundException(
        `No collateral reserve for mint ${supplyMint}. Available: ${available.join(', ') || 'none'}`,
      );
    }
    return { reserve: entry.reserve, market: KAMINO_MARKET };
  }

  getUsdcReserve(): { reserve: string; market: string } {
    return { reserve: USDC_RESERVE, market: KAMINO_MARKET };
  }

  getReserves() {
    return {
      market: KAMINO_MARKET,
      usdcReserve: USDC_RESERVE,
      earnVaults: EARN_VAULTS_ARRAY,
      borrowCollaterals: BORROW_COLLATERALS_ARRAY,
    };
  }
}
