import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return this.prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, isPublished: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async create(dto: CreateBlogDto) {
    const data: any = { ...dto };
    if (dto.isPublished) {
      data.publishedAt = new Date();
    }
    return this.prisma.blogPost.create({ data });
  }

  async update(id: string, dto: UpdateBlogDto) {
    const existing = await this.findOne(id);

    const data: Record<string, any> = { ...dto };

    // Set publishedAt when transitioning to published
    if (dto.isPublished === true && !existing.isPublished) {
      data.publishedAt = new Date();
    }
    // Clear publishedAt when unpublishing
    if (dto.isPublished === false) {
      data.publishedAt = null;
    }

    return this.prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
