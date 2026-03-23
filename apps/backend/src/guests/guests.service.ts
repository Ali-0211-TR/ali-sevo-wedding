import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGuestDto } from './dto/create-guest.dto.js';
import { UpdateGuestDto } from './dto/update-guest.dto.js';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    search?: string;
    language?: string;
    rsvpStatus?: string;
  }) {
    const where: Prisma.GuestWhereInput = {};

    if (params?.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params?.language) {
      where.language = params.language as any;
    }

    if (params?.rsvpStatus) {
      where.rsvpStatus = params.rsvpStatus as any;
    }

    return this.prisma.guest.findMany({
      where,
      include: { invitation: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { id },
      include: { invitation: true },
    });
    if (!guest) throw new NotFoundException('Guest not found');
    return guest;
  }

  async create(dto: CreateGuestDto) {
    return this.prisma.guest.create({
      data: dto,
      include: { invitation: true },
    });
  }

  async update(id: string, dto: UpdateGuestDto) {
    await this.findOne(id);
    return this.prisma.guest.update({
      where: { id },
      data: dto,
      include: { invitation: true },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.guest.delete({ where: { id } });
  }
}
