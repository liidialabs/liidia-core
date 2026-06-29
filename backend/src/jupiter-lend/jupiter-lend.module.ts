import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jupiterConfig } from '../config/configuration';
import { JupiterLendController } from './jupiter-lend.controller';
import { JupiterLendService } from './jupiter-lend.service';
import { VaultsResolverService } from './vaults-resolver.service';

@Module({
  imports: [ConfigModule.forFeature(jupiterConfig)],
  controllers: [JupiterLendController],
  providers: [JupiterLendService, VaultsResolverService],
})
export class JupiterLendModule {}
