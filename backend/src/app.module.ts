import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KaminoModule } from './kamino/kamino.module';
import { JupiterLendModule } from './jupiter-lend/jupiter-lend.module';
import { kaminoConfig, jupiterConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kaminoConfig, jupiterConfig],
    }),
    KaminoModule,
    JupiterLendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
