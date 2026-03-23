import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '../../generated/prisma/client.js';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlockDto {
  @ApiProperty({ description: 'ID of the page this block belongs to' })
  @IsString()
  @IsNotEmpty()
  pageId: string;

  @ApiProperty({
    description: 'Block type',
    enum: BlockType,
    example: BlockType.HERO,
  })
  @IsEnum(BlockType)
  type: BlockType;

  @ApiProperty({
    description: 'Block content (JSON, varies by type)',
    example: { heading: { ru: 'Добро пожаловать', en: 'Welcome' } },
  })
  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Block display settings (JSON)',
    example: { backgroundColor: '#fff', padding: '2rem' },
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Sort order within the page', default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
