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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CreateGuestDto } from './dto/create-guest.dto.js';
import { UpdateGuestDto } from './dto/update-guest.dto.js';
import { GuestsService } from './guests.service.js';

@ApiTags('Guests')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'rsvpStatus', required: false })
  findAll(
    @Query('search') search?: string,
    @Query('language') language?: string,
    @Query('rsvpStatus') rsvpStatus?: string,
  ) {
    return this.guestsService.findAll({ search, language, rsvpStatus });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGuestDto) {
    return this.guestsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGuestDto) {
    return this.guestsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.guestsService.delete(id);
  }
}
