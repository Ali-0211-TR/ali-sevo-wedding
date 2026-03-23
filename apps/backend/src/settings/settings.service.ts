import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';

const SETTINGS_ID = 'main';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    // Upsert: return existing or create default
    return this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: {},
      create: { id: SETTINGS_ID },
    });
  }

  async update(dto: UpdateSettingsDto) {
    const data: Record<string, any> = { ...dto };

    // Convert weddingDate string to Date if provided
    if (dto.weddingDate) {
      data.weddingDate = new Date(dto.weddingDate);
    }

    return this.prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: data,
      create: { id: SETTINGS_ID, ...data },
    });
  }
}
