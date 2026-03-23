import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePageDto } from './dto/create-page.dto.js';
import { UpdatePageDto } from './dto/update-page.dto.js';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.page.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        blocks: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        blocks: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug, isPublished: true },
      include: {
        blocks: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findPublished() {
    return this.prisma.page.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        blocks: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async create(dto: CreatePageDto) {
    return this.prisma.page.create({ data: dto });
  }

  async update(id: string, dto: UpdatePageDto) {
    await this.findOne(id);
    return this.prisma.page.update({
      where: { id },
      data: dto,
      include: {
        blocks: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.page.delete({ where: { id } });
  }

  async reorder(items: { id: string; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.page.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );
    return this.prisma.$transaction(updates);
  }
}
