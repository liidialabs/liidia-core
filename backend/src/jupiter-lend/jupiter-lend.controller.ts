import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JupiterLendService } from './jupiter-lend.service';
import { VaultsResolverService } from './vaults-resolver.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { OperateDto } from './dto/operate.dto';
import { DepositDto } from './dto/deposit.dto';
import { BorrowDto } from './dto/borrow.dto';
import { RepayDto } from './dto/repay.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('jupiter-lend')
export class JupiterLendController {
  constructor(
    private readonly service: JupiterLendService,
    private readonly resolver: VaultsResolverService,
  ) {}

  @Get('vaults')
  getAllVaults() {
    return this.service.getAllVaults();
  }

  @Get('vaults/active')
  getActiveVaults() {
    return this.resolver.getActiveVaults();
  }

  @Get('vaults/:vaultId')
  getVaultByVaultId(@Param('vaultId') vaultId: string) {
    return this.service.getVaultByVaultId(Number(vaultId));
  }

  @Get('vaults/:vaultId/positions')
  getAllPositionIdsForVault(@Param('vaultId') vaultId: string) {
    return this.service.getAllPositionIdsForVault(Number(vaultId));
  }

  @Get('vaults/:vaultId/positions/:positionId')
  getPositionByVaultId(
    @Param('vaultId') vaultId: string,
    @Param('positionId') positionId: string,
  ) {
    return this.service.getPositionByVaultId(Number(vaultId), Number(positionId));
  }

  @Get('lending')
  getAllLendings() {
    return this.service.getAllLendings();
  }

  @Get('lending/:tokenMint')
  getJlTokenDetails(@Param('tokenMint') tokenMint: string) {
    return this.service.getJlTokenDetails(tokenMint);
  }

  @Get('liquidity')
  getAllOverallTokensData() {
    return this.service.getAllOverallTokensData();
  }

  @Get('liquidity/:tokenMint')
  getOverallTokenData(@Param('tokenMint') tokenMint: string) {
    return this.service.getOverallTokenData(tokenMint);
  }

  @Post('create-position')
  createPosition(@Body() dto: CreatePositionDto) {
    return this.service.createPosition(dto.vaultId, dto.wallet);
  }

  @Post('operate')
  operate(@Body() dto: OperateDto) {
    return this.service.operate(dto.vaultId, dto.positionId, dto.wallet, dto.colAmount, dto.debtAmount);
  }

  @Get('reserves')
  getReserves() {
    return this.resolver.getReserves();
  }

  @Get('deposit/tokens')
  getDepositTokens() {
    return this.resolver.getDepositTokens();
  }

  @Post('deposit')
  deposit(@Body() dto: DepositDto) {
    const vaultId = this.resolver.resolveVaultId(dto.supplyMint);
    if (dto.positionId !== undefined) {
      return this.service.operate(vaultId, dto.positionId, dto.wallet, dto.amount, '0');
    }
    return this.service.createPosition(vaultId, dto.wallet);
  }

  @Post('borrow')
  borrow(@Body() dto: BorrowDto) {
    const vaultId = this.resolver.resolveVaultId(dto.supplyMint);
    return this.service.operate(vaultId, dto.positionId, dto.wallet, '0', `-${dto.amount}`);
  }

  @Post('repay')
  repay(@Body() dto: RepayDto) {
    const vaultId = this.resolver.resolveVaultId(dto.supplyMint);
    return this.service.operate(vaultId, dto.positionId, dto.wallet, '0', dto.amount);
  }

  @Post('withdraw')
  withdraw(@Body() dto: WithdrawDto) {
    const vaultId = this.resolver.resolveVaultId(dto.supplyMint);
    return this.service.operate(vaultId, dto.positionId, dto.wallet, `-${dto.amount}`, '0');
  }
}
