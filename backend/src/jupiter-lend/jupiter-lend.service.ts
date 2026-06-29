import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Connection, PublicKey, Transaction, VersionedTransaction, TransactionMessage } from '@solana/web3.js';
import { jupiterConfig } from '../config/configuration';
import BN from 'bn.js';

@Injectable()
export class JupiterLendService {
  private readonly logger = new Logger(JupiterLendService.name);
  private connection: Connection;

  constructor(
    @Inject(jupiterConfig.KEY)
    private readonly config: ConfigType<typeof jupiterConfig>,
  ) {
    this.connection = new Connection(this.config.rpcEndpoint, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: true,
    });
  }

  private async createClient() {
    const { Client } = await import('@jup-ag/lend-read');
    return new Client(this.connection);
  }

  async getAllVaults() {
    const client = await this.createClient();
    return client.vault.getAllVaults();
  }

  async getVaultByVaultId(vaultId: number) {
    const client = await this.createClient();
    return client.vault.getVaultByVaultId(vaultId);
  }

  async getAllPositionIdsForVault(vaultId: number) {
    const client = await this.createClient();
    return client.vault.getAllPositionIdsForVault(vaultId);
  }

  async getPositionByVaultId(vaultId: number, positionId: number) {
    const client = await this.createClient();
    return client.vault.getPositionByVaultId(vaultId, positionId);
  }

  async getAllLendings() {
    const client = await this.createClient();
    return client.lending.getAllLendings();
  }

  async getJlTokenDetails(tokenMint: string) {
    const client = await this.createClient();
    return client.lending.getJlTokenDetails(new PublicKey(tokenMint));
  }

  async getAllOverallTokensData() {
    const client = await this.createClient();
    return client.liquidity.getAllOverallTokensData();
  }

  async getOverallTokenData(tokenMint: string) {
    const client = await this.createClient();
    return client.liquidity.getOverallTokenData(new PublicKey(tokenMint));
  }

  async createPosition(vaultId: number, wallet: string) {
    const { getInitPositionIx, getVaultsProgram } = await import('@jup-ag/lend/borrow');
    const signer = new PublicKey(wallet);
    getVaultsProgram({ connection: this.connection, signer });
    const { ix, nftId } = await getInitPositionIx({
      vaultId,
      connection: this.connection,
      signer,
    });
    const recentBlockhash = await this.connection.getLatestBlockhash();
    const tx = new Transaction({
      feePayer: signer,
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
    });
    tx.add(ix);
    const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
    return {
      transaction: serialized.toString('base64'),
      nftId: nftId.toString(),
    };
  }

  async operate(vaultId: number, positionId: number, wallet: string, colAmount?: string, debtAmount?: string) {
    const { getOperateIx, getVaultsProgram } = await import('@jup-ag/lend/borrow');
    const signer = new PublicKey(wallet);
    getVaultsProgram({ connection: this.connection, signer });
    const colBn = colAmount ? new BN(colAmount) : new BN(0);
    const debtBn = debtAmount ? new BN(debtAmount) : new BN(0);
    const { ixs, addressLookupTableAccounts } = await getOperateIx({
      vaultId,
      positionId,
      colAmount: colBn,
      debtAmount: debtBn,
      connection: this.connection,
      signer,
    });
    const recentBlockhash = await this.connection.getLatestBlockhash();
    const message = new TransactionMessage({
      payerKey: signer,
      recentBlockhash: recentBlockhash.blockhash,
      instructions: ixs,
    }).compileToV0Message(addressLookupTableAccounts);
    const tx = new VersionedTransaction(message);
    const serialized = tx.serialize();
    return {
      transaction: Buffer.from(serialized).toString('base64'),
    };
  }
}
