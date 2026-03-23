import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Translatable JSON: { "ru": "...", "uz": "...", "en": "...", "tr": "..." }',
    example: { ru: 'Никох', uz: 'Nikoh', en: 'Ceremony', tr: 'Nikah' },
  })
  @IsObject()
  @IsNotEmpty()
  title: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Translatable JSON',
    example: { ru: 'Описание', uz: 'Tavsif', en: 'Description', tr: 'Açıklama' },
  })
  @IsObject()
  @IsOptional()
  description?: Record<string, string>;

  @ApiPropertyOptional({ example: 'Grand Ballroom' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: '123 Wedding St, Tashkent' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://maps.google.com/...' })
  @IsString()
  @IsOptional()
  mapUrl?: string;

  @ApiProperty({ example: '2026-06-15T14:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: '2026-06-15T22:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/cover.jpg' })
  @IsString()
  @IsOptional()
  coverImage?: string;
}
