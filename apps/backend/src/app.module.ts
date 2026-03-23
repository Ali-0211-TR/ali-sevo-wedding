import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { GuestsModule } from './guests/guests.module.js';
import { InvitationsModule } from './invitations/invitations.module.js';
import { EventsModule } from './events/events.module.js';
import { PagesModule } from './pages/pages.module.js';
import { BlocksModule } from './blocks/blocks.module.js';
import { BlogModule } from './blog/blog.module.js';
import { MediaModule } from './media/media.module.js';
import { SettingsModule } from './settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    GuestsModule,
    InvitationsModule,
    EventsModule,
    PagesModule,
    BlocksModule,
    BlogModule,
    MediaModule,
    SettingsModule,
  ],
})
export class AppModule {}
