import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CreateBlockDto } from './dto/create-block.dto.js';
import { UpdateBlockDto } from './dto/update-block.dto.js';
import { BlocksService } from './blocks.service.js';

@ApiTags('Blocks')
@Controller('blocks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  findByPage(@Query('pageId') pageId: string) {
    return this.blocksService.findByPage(pageId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBlockDto) {
    return this.blocksService.create(dto);
  }

  @Patch('reorder')
  reorder(@Body() items: { id: string; sortOrder: number }[]) {
    return this.blocksService.reorder(items);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlockDto) {
    return this.blocksService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blocksService.delete(id);
  }
}
