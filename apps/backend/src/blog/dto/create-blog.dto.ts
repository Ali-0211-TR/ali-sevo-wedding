import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'URL slug for the blog post',
    example: 'our-wedding-preparations',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Translatable JSON: { "ru": "...", "uz": "...", "en": "...", "tr": "..." }',
    example: { ru: 'Подготовка к свадьбе', en: 'Wedding Preparations' },
  })
  @IsObject()
  @IsNotEmpty()
  title: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Translatable excerpt JSON',
    example: { ru: 'Краткое описание...', en: 'Short description...' },
  })
  @IsObject()
  @IsOptional()
  excerpt?: Record<string, string>;

  @ApiProperty({
    description: 'Translatable content JSON',
    example: { ru: 'Полный текст...', en: 'Full text...' },
  })
  @IsObject()
  @IsNotEmpty()
  content: Record<string, string>;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Whether the post is published', default: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
