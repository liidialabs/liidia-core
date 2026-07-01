import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KaminoModule } from './kamino/kamino.module';
import { RecipientModule } from './recipient/recipient.module';
import { CountriesModule } from './countries/countries.module';
import { FxRatesModule } from './fx-rates/fx-rates.module';
import { PrismaModule } from './prisma/prisma.module';
import { kaminoConfig, redisConfig, databaseConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kaminoConfig, redisConfig, databaseConfig],
    }),
    PrismaModule,
    KaminoModule,
    RecipientModule,
    CountriesModule,
    FxRatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
