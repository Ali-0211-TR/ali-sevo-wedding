import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Language } from '../../generated/prisma/client.js';

export class CreateGuestDto {
  @ApiProperty({ example: 'Alishan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Tursunov' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'guest@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: Language, default: Language.RU })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @ApiPropertyOptional({ example: 'Childhood friend' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  invitationId?: string;

  @ApiPropertyOptional({ example: 'Vegetarian' })
  @IsString()
  @IsOptional()
  dietaryNeeds?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  plusOne?: boolean;
}
