import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';

@Controller('recipients')
export class RecipientController {
  constructor(private readonly service: RecipientService) {}

  @Post()
  create(@Body() dto: CreateRecipientDto) {
    return this.service.create(dto);
  }

  @Get()
  findByWallet(@Query('wallet') wallet: string) {
    return this.service.findByWallet(wallet);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecipientDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
