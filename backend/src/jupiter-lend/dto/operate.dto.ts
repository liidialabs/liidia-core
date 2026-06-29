import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OperateDto {
  @IsNumber()
  vaultId: number;

  @IsNumber()
  positionId: number;

  @IsString()
  wallet: string;

  @IsOptional()
  @IsString()
  colAmount?: string;

  @IsOptional()
  @IsString()
  debtAmount?: string;
}
