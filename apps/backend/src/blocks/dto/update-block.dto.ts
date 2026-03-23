import { PartialType } from '@nestjs/swagger';
import { CreateBlockDto } from './create-block.dto.js';

export class UpdateBlockDto extends PartialType(CreateBlockDto) {}
