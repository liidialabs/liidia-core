import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { VAULT_MAP, VAULT_MAP_ARRAY } from './vaults.config';

export interface DepositToken {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  vaultId: number;
}

@Injectable()
export class VaultsResolverService {
  private readonly logger = new Logger(VaultsResolverService.name);
  private readonly vaultMap = VAULT_MAP;
  private readonly vaultArray = VAULT_MAP_ARRAY;

  getActiveVaults() {
    return this.vaultArray;
  }

  getDepositTokens(): DepositToken[] {
    return this.vaultArray.map((v) => ({
      mint: v.mint,
      symbol: v.symbol,
      name: v.name,
      decimals: v.decimals,
      vaultId: v.vaultId,
    }));
  }

  getReserves() {
    return { vaults: this.vaultArray };
  }

  resolveVaultId(supplyMint: string): number {
    const entry = this.vaultMap[supplyMint];
    if (!entry) {
      const available = this.vaultArray.map((v) => v.symbol);
      throw new NotFoundException(
        `No vault for supply token ${supplyMint}. Available: ${available.join(', ') || 'none (map empty)'}`,
      );
    }
    return entry.vaultId;
  }
}
