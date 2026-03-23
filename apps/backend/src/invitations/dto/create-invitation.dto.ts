import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { InvitationType, Language } from '../../generated/prisma/client.js';

export class CreateInvitationDto {
  @ApiProperty({ enum: InvitationType, default: InvitationType.INDIVIDUAL })
  @IsEnum(InvitationType)
  type: InvitationType;

  @ApiPropertyOptional({ enum: Language, default: Language.RU })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customGreeting?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customMessage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customClosing?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  guestIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  eventIds?: string[];
}
