import { PartialType } from '@nestjs/swagger';
import { CreateInvitationDto } from './create-invitation.dto.js';

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {}
