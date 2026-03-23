import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { UpdateInvitationDto } from './dto/update-invitation.dto.js';

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  private readonly includeRelations = {
    guests: true,
    invitationEvents: {
      include: { event: true },
    },
  };

  async findAll() {
    return this.prisma.invitation.findMany({
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: this.includeRelations,
    });
    if (!invitation) throw new NotFoundException('Invitation not found');
    return invitation;
  }

  async findBySlug(slug: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { slug },
      include: this.includeRelations,
    });
    if (!invitation) throw new NotFoundException('Invitation not found');
    return invitation;
  }

  async create(dto: CreateInvitationDto) {
    const { guestIds, eventIds, ...data } = dto;

    let slug = this.generateSlug();
    // Ensure slug uniqueness
    while (await this.prisma.invitation.findUnique({ where: { slug } })) {
      slug = this.generateSlug();
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        ...data,
        slug,
        ...(guestIds?.length && {
          guests: {
            connect: guestIds.map((id) => ({ id })),
          },
        }),
        ...(eventIds?.length && {
          invitationEvents: {
            create: eventIds.map((eventId) => ({ eventId })),
          },
        }),
      },
      include: this.includeRelations,
    });

    return invitation;
  }

  async update(id: string, dto: UpdateInvitationDto) {
    await this.findOne(id);
    const { guestIds, eventIds, ...data } = dto;

    // If guestIds provided, reset and reconnect
    if (guestIds !== undefined) {
      await this.prisma.guest.updateMany({
        where: { invitationId: id },
        data: { invitationId: null },
      });
      if (guestIds.length) {
        await this.prisma.guest.updateMany({
          where: { id: { in: guestIds } },
          data: { invitationId: id },
        });
      }
    }

    // If eventIds provided, reset and recreate
    if (eventIds !== undefined) {
      await this.prisma.invitationEvent.deleteMany({
        where: { invitationId: id },
      });
      if (eventIds.length) {
        await this.prisma.invitationEvent.createMany({
          data: eventIds.map((eventId) => ({ invitationId: id, eventId })),
        });
      }
    }

    return this.prisma.invitation.update({
      where: { id },
      data,
      include: this.includeRelations,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.invitation.delete({ where: { id } });
  }

  async addGuest(invitationId: string, guestId: string) {
    await this.findOne(invitationId);
    return this.prisma.guest.update({
      where: { id: guestId },
      data: { invitationId },
    });
  }

  async removeGuest(invitationId: string, guestId: string) {
    await this.findOne(invitationId);
    return this.prisma.guest.update({
      where: { id: guestId, invitationId },
      data: { invitationId: null },
    });
  }

  async addEvent(invitationId: string, eventId: string) {
    await this.findOne(invitationId);
    return this.prisma.invitationEvent.create({
      data: { invitationId, eventId },
    });
  }

  async removeEvent(invitationId: string, eventId: string) {
    await this.findOne(invitationId);
    return this.prisma.invitationEvent.delete({
      where: {
        invitationId_eventId: { invitationId, eventId },
      },
    });
  }
}
