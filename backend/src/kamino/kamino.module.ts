import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KaminoController } from './kamino.controller';
import { KaminoService } from './kamino.service';
import { KaminoResolverService } from './kamino-resolver.service';
import { kaminoConfig } from '../config/configuration';

@Module({
  imports: [ConfigModule.forFeature(kaminoConfig)],
  controllers: [KaminoController],
  providers: [KaminoService, KaminoResolverService],
})
export class KaminoModule {}
