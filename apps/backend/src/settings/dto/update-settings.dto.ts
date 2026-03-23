import { ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from '../../generated/prisma/client.js';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({
    description: 'Translatable JSON',
    example: { ru: 'Свадьба', en: 'Wedding' },
  })
  @IsObject()
  @IsOptional()
  siteTitle?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Translatable JSON',
    example: { ru: 'Алишан & Севинч', en: 'Alishan & Sevinch' },
  })
  @IsObject()
  @IsOptional()
  coupleNames?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Wedding date' })
  @IsDateString()
  @IsOptional()
  weddingDate?: string;

  @ApiPropertyOptional({ description: 'Translatable venue name' })
  @IsObject()
  @IsOptional()
  venue?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Translatable venue address' })
  @IsObject()
  @IsOptional()
  venueAddress?: Record<string, string>;

  @ApiPropertyOptional({ example: '#b08968' })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#ddb892' })
  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @ApiPropertyOptional({ example: '#7f5539' })
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiPropertyOptional({ example: 'Playfair Display' })
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @ApiPropertyOptional({ example: 'Lato' })
  @IsString()
  @IsOptional()
  bodyFontFamily?: string;

  @ApiPropertyOptional({ description: 'URL to background music file' })
  @IsString()
  @IsOptional()
  backgroundMusicUrl?: string;

  @ApiPropertyOptional({ description: 'Auto-play background music', default: false })
  @IsBoolean()
  @IsOptional()
  musicAutoplay?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegramUrl?: string;

  @ApiPropertyOptional({ description: 'Translatable meta description' })
  @IsObject()
  @IsOptional()
  metaDescription?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Open Graph image URL' })
  @IsString()
  @IsOptional()
  ogImage?: string;

  @ApiPropertyOptional({ description: 'Favicon URL' })
  @IsString()
  @IsOptional()
  favicon?: string;

  @ApiPropertyOptional({ enum: Language, description: 'Default language' })
  @IsEnum(Language)
  @IsOptional()
  defaultLanguage?: Language;
}
