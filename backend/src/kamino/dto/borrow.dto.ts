import { IsString } from 'class-validator';

export class BorrowDto {
  @IsString()
  wallet: string;

  @IsString()
  supplyMint: string;

  @IsString()
  amount: string;
}
