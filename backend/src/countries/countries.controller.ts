import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get()
  getCountries() {
    return this.service.getCountries();
  }

  @Get('crypto/providers')
  getCryptoProviders() {
    return this.service.getCryptoProviders();
  }

  @Get(':code/providers')
  getProviders(@Param('code') code: string) {
    return this.service.getProvidersForCountry(code.toUpperCase());
  }
}
