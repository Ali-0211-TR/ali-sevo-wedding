import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePageDto {
  @ApiProperty({
    description: 'URL slug for the page',
    example: 'our-story',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Translatable JSON: { "ru": "...", "uz": "...", "en": "...", "tr": "..." }',
    example: { ru: 'Наша история', uz: 'Bizning hikoyamiz', en: 'Our Story', tr: 'Hikayemiz' },
  })
  @IsObject()
  @IsNotEmpty()
  title: Record<string, string>;

  @ApiPropertyOptional({ description: 'Whether the page is published', default: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Sort order for navigation', default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Show this page in navigation', default: true })
  @IsBoolean()
  @IsOptional()
  showInNav?: boolean;
}
