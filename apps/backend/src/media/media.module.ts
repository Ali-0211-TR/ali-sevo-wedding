import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MediaService } from './media.service.js';
import { MediaController } from './media.controller.js';

const uploadsDir = join(__dirname, '..', '..', 'uploads');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: uploadsDir,
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
