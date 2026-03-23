import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaType } from '../generated/prisma/client.js';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { PrismaService } from '../prisma/prisma.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');
const THUMBNAILS_DIR = join(UPLOADS_DIR, 'thumbnails');

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {
    // Ensure upload directories exist
    if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
    if (!existsSync(THUMBNAILS_DIR)) mkdirSync(THUMBNAILS_DIR, { recursive: true });
  }

  async create(file: Express.Multer.File, alt?: string) {
    const mediaType = this.resolveMediaType(file.mimetype);
    let thumbnailUrl: string | null = null;

    // Generate thumbnail for images
    if (mediaType === MediaType.IMAGE) {
      const thumbFilename = `thumb_${file.filename}`;
      const thumbPath = join(THUMBNAILS_DIR, thumbFilename);
      await sharp(file.path)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .toFile(thumbPath);
      thumbnailUrl = `/uploads/thumbnails/${thumbFilename}`;
    }

    return this.prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        thumbnailUrl,
        type: mediaType,
        alt: alt || null,
      },
    });
  }

  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async delete(id: string) {
    const media = await this.findOne(id);

    // Remove file from disk
    const filePath = join(UPLOADS_DIR, media.filename);
    if (existsSync(filePath)) unlinkSync(filePath);

    // Remove thumbnail if exists
    if (media.thumbnailUrl) {
      const thumbPath = join(UPLOADS_DIR, 'thumbnails', `thumb_${media.filename}`);
      if (existsSync(thumbPath)) unlinkSync(thumbPath);
    }

    return this.prisma.media.delete({ where: { id } });
  }

  private resolveMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    if (mimeType.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.IMAGE;
  }
}
