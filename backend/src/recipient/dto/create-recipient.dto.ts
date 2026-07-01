import { IsString, IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRecipientDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsIn(['mobile', 'crypto'])
  type: 'mobile' | 'crypto';

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  cryptoAddress?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsOptional()
  @IsString()
  label?: string;
}
