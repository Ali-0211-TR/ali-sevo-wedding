import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PagesService } from './pages.service.js';
import { PagesController } from './pages.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
