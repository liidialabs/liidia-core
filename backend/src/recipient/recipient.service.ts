import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';

@Injectable()
export class RecipientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecipientDto) {
    return this.prisma.recipient.create({
      data: {
        walletAddress: dto.walletAddress,
        type: dto.type,
        phoneNumber: dto.phoneNumber ?? null,
        cryptoAddress: dto.cryptoAddress ?? null,
        countryCode: dto.countryCode ?? null,
        provider: dto.provider,
        label: dto.label ?? null,
      },
    });
  }

  async findByWallet(walletAddress: string) {
    return this.prisma.recipient.findMany({
      where: { walletAddress },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateRecipientDto) {
    try {
      return await this.prisma.recipient.update({
        where: { id },
        data: {
          ...(dto.type !== undefined && { type: dto.type }),
          ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
          ...(dto.cryptoAddress !== undefined && { cryptoAddress: dto.cryptoAddress }),
          ...(dto.countryCode !== undefined && { countryCode: dto.countryCode }),
          ...(dto.provider !== undefined && { provider: dto.provider }),
          ...(dto.label !== undefined && { label: dto.label }),
        },
      });
    } catch {
      throw new NotFoundException(`Recipient ${id} not found`);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.recipient.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Recipient ${id} not found`);
    }
  }
}
