import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { KaminoService } from './kamino.service';
import { KaminoResolverService } from './kamino-resolver.service';
import { BorrowDto } from './dto/borrow.dto';

@Controller('kamino')
export class KaminoController {
  constructor(
    private readonly kaminoService: KaminoService,
    private readonly resolver: KaminoResolverService,
  ) {}

  @Post('borrow/borrow')
  async borrow(@Body() dto: BorrowDto) {
    const { reserve, market } = this.resolver.resolveBorrowReserve(dto.supplyMint);
    return this.kaminoService.buildBorrow(dto.wallet, market, reserve, dto.amount);
  }

  @Post('borrow/repay')
  async repay(@Body() dto: BorrowDto) {
    const { reserve, market } = this.resolver.resolveBorrowReserve(dto.supplyMint);
    return this.kaminoService.buildRepay(dto.wallet, market, reserve, dto.amount);
  }

  @Get('market/:address')
  async getMarket(@Param('address') address: string) {
    return this.kaminoService.getMarket(address);
  }

  @Get('obligations/:market/:user')
  async getObligations(@Param('market') market: string, @Param('user') user: string) {
    return this.kaminoService.getUserObligations(market, user);
  }

  @Get('rates')
  async getBorrowRates() {
    return this.kaminoService.getBorrowRates();
  }

  @Get('reserves')
  getReserves() {
    return this.resolver.getReserves();
  }

  @Get('reserves/metrics/:market')
  async getReserveMetrics(@Param('market') market: string) {
    return this.kaminoService.getReserveMetrics(market);
  }
}
