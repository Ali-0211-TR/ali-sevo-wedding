import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { UpdateInvitationDto } from './dto/update-invitation.dto.js';
import { InvitationsService } from './invitations.service.js';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // ── Public endpoint (no auth) ──────────────────────────────
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.invitationsService.findBySlug(slug);
  }

  // ── Protected endpoints ────────────────────────────────────
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  findAll() {
    return this.invitationsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  create(@Body() dto: CreateInvitationDto) {
    return this.invitationsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateInvitationDto) {
    return this.invitationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  delete(@Param('id') id: string) {
    return this.invitationsService.delete(id);
  }

  @Post(':id/guests/:guestId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  addGuest(
    @Param('id') id: string,
    @Param('guestId') guestId: string,
  ) {
    return this.invitationsService.addGuest(id, guestId);
  }

  @Delete(':id/guests/:guestId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  removeGuest(
    @Param('id') id: string,
    @Param('guestId') guestId: string,
  ) {
    return this.invitationsService.removeGuest(id, guestId);
  }

  @Post(':id/events/:eventId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  addEvent(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
  ) {
    return this.invitationsService.addEvent(id, eventId);
  }

  @Delete(':id/events/:eventId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
  removeEvent(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
  ) {
    return this.invitationsService.removeEvent(id, eventId);
  }
}
