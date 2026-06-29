import { IsOptional, IsString } from 'class-validator';

export class BorrowCollateralDto {
  @IsString()
  supplyMint: string;

  @IsString()
  wallet: string;

  @IsString()
  amount: string;
}

export class BorrowUsdcDto {
  @IsString()
  wallet: string;

  @IsString()
  amount: string;
}
