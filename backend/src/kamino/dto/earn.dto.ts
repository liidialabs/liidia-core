import { IsString } from 'class-validator';

export class EarnDto {
  @IsString()
  supplyMint: string;

  @IsString()
  wallet: string;

  @IsString()
  amount: string;
}
