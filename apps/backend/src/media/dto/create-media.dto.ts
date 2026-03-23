import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @ApiPropertyOptional({ description: 'Alt text for the media file' })
  @IsString()
  @IsOptional()
  alt?: string;
}
