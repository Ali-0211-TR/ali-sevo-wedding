import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBlockDto } from './dto/create-block.dto.js';
import { UpdateBlockDto } from './dto/update-block.dto.js';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPage(pageId: string) {
    return this.prisma.block.findMany({
      where: { pageId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const block = await this.prisma.block.findUnique({ where: { id } });
    if (!block) throw new NotFoundException('Block not found');
    return block;
  }

  async create(dto: CreateBlockDto) {
    return this.prisma.block.create({ data: dto });
  }

  async update(id: string, dto: UpdateBlockDto) {
    await this.findOne(id);
    return this.prisma.block.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.block.delete({ where: { id } });
  }

  async reorder(items: { id: string; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.block.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    return this.prisma.$transaction(updates);
  }
}
