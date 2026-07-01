import { IsString, IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateRecipientDto {
  @IsOptional()
  @IsString()
  @IsIn(['mobile', 'crypto'])
  type?: 'mobile' | 'crypto';

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  cryptoAddress?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  provider?: string;

  @IsOptional()
  @IsString()
  label?: string;
}
