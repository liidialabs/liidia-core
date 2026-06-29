import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNumber()
  vaultId: number;

  @IsString()
  wallet: string;
}
