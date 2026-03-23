import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BlocksService } from './blocks.service.js';
import { BlocksController } from './blocks.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
