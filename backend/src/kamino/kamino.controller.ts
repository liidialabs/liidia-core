import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { KaminoService } from './kamino.service';
import { KaminoResolverService } from './kamino-resolver.service';
import { EarnDto } from './dto/earn.dto';
import { BorrowCollateralDto, BorrowUsdcDto } from './dto/borrow.dto';

@Controller('kamino')
export class KaminoController {
  constructor(
    private readonly kaminoService: KaminoService,
    private readonly resolver: KaminoResolverService,
  ) {}

  @Get('earn/deposit/tokens')
  getEarnDepositTokens() {
    return this.resolver.getEarnDepositTokens();
  }

  @Post('earn/deposit')
  async earnDeposit(@Body() dto: EarnDto) {
    const kvault = this.resolver.resolveEarnVault(dto.supplyMint);
    return this.kaminoService.buildEarnDeposit(dto.wallet, kvault, dto.amount);
  }

  @Post('earn/withdraw')
  async earnWithdraw(@Body() dto: EarnDto) {
    const kvault = this.resolver.resolveEarnVault(dto.supplyMint);
    return this.kaminoService.buildEarnWithdraw(dto.wallet, kvault, dto.amount);
  }

  @Get('borrow/collateral/tokens')
  getBorrowCollateralTokens() {
    return this.resolver.getBorrowCollateralTokens();
  }

  @Post('borrow/deposit')
  async borrowDeposit(@Body() dto: BorrowCollateralDto) {
    const { reserve, market } = this.resolver.resolveCollateralReserve(dto.supplyMint);
    return this.kaminoService.buildBorrowDeposit(dto.wallet, market, reserve, dto.amount);
  }

  @Post('borrow/borrow')
  async borrow(@Body() dto: BorrowUsdcDto) {
    const { reserve, market } = this.resolver.getUsdcReserve();
    return this.kaminoService.buildBorrow(dto.wallet, market, reserve, dto.amount);
  }

  @Post('borrow/repay')
  async repay(@Body() dto: BorrowUsdcDto) {
    const { reserve, market } = this.resolver.getUsdcReserve();
    return this.kaminoService.buildRepay(dto.wallet, market, reserve, dto.amount);
  }

  @Post('borrow/withdraw')
  async withdraw(@Body() dto: BorrowCollateralDto) {
    const { reserve, market } = this.resolver.resolveCollateralReserve(dto.supplyMint);
    return this.kaminoService.buildWithdraw(dto.wallet, market, reserve, dto.amount);
  }

  @Get('market/:address')
  async getMarket(@Param('address') address: string) {
    return this.kaminoService.getMarket(address);
  }

  @Get('obligations/:market/:user')
  async getObligations(@Param('market') market: string, @Param('user') user: string) {
    return this.kaminoService.getUserObligations(market, user);
  }

  @Get('reserves')
  getReserves() {
    return this.resolver.getReserves();
  }

  @Get('earn/vaults')
  async getEarnVaults() {
    return this.kaminoService.getEarnVaults();
  }

  @Get('earn/positions/:wallet')
  async getUserVaultPositions(@Param('wallet') wallet: string) {
    return this.kaminoService.getUserVaultPositions(wallet);
  }

  @Get('reserves/metrics/:market')
  async getReserveMetrics(@Param('market') market: string) {
    return this.kaminoService.getReserveMetrics(market);
  }
}
