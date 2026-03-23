import { PartialType } from '@nestjs/swagger';
import { CreateGuestDto } from './create-guest.dto.js';

export class UpdateGuestDto extends PartialType(CreateGuestDto) {}
