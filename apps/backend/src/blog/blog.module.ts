import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BlogService } from './blog.service.js';
import { BlogController } from './blog.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
