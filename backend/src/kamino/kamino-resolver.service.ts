import { Injectable, NotFoundException } from '@nestjs/common';
import {
  KAMINO_MARKET,
  BORROW_ASSETS,
} from './reserves.config';

export const BORROW_ASSETS_BY_RESERVE = Object.fromEntries(
  Object.values(BORROW_ASSETS).map((a) => [a.reserve, a]),
);

@Injectable()
export class KaminoResolverService {

  resolveBorrowReserve(mintSymbol: string): { reserve: string; market: string } {
    const entry = BORROW_ASSETS[mintSymbol];
    if (!entry) {
      const available = Object.values(BORROW_ASSETS).map((a) => `${a.symbol} (${a.reserve})`);
      throw new NotFoundException(
        `No borrow reserve for mint ${mintSymbol}. Available: ${available.join(', ') || 'none'}`,
      );
    }
    return { reserve: entry.reserve, market: KAMINO_MARKET };
  }

  getReserves() {
    return {
      market: KAMINO_MARKET,
      borrowAssets: BORROW_ASSETS,
    };
  }
}
