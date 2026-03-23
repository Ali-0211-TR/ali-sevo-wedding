import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: [{ sortOrder: 'asc' }, { date: 'asc' }],
      include: {
        invitationEvents: {
          include: { invitation: true },
        },
      },
    });
  }

  async findPublished() {
    return this.prisma.event.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { date: 'asc' }],
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        invitationEvents: {
          include: { invitation: true },
        },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id);

    const data: Record<string, any> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.event.delete({ where: { id } });
  }
}
