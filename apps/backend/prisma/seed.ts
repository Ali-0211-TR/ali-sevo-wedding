import 'dotenv/config';
import { PrismaClient, UserRole, Language } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create super admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@wedding.com' },
    update: {},
    create: {
      email: 'admin@wedding.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Create default site settings
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteTitle: {
        ru: 'Свадьба Алишана и Севинч',
        uz: 'Alishan va Sevinch to\'yi',
        en: 'Wedding of Alishan & Sevinch',
        tr: 'Alishan & Sevinch Düğünü',
      },
      coupleNames: {
        ru: 'Алишан & Севинч',
        uz: 'Alishan & Sevinch',
        en: 'Alishan & Sevinch',
        tr: 'Alishan & Sevinch',
      },
      weddingDate: new Date('2026-09-15T14:00:00Z'),
      venue: {
        ru: 'Ресторан "Бухара"',
        uz: 'Restoran "Buxoro"',
        en: 'Restaurant "Bukhara"',
        tr: 'Restoran "Buhara"',
      },
      primaryColor: '#b08968',
      secondaryColor: '#ddb892',
      accentColor: '#7f5539',
      defaultLanguage: Language.RU,
    },
  });

  // Create default events
  const weddingEvent = await prisma.event.upsert({
    where: { id: 'evt-wedding' },
    update: {},
    create: {
      id: 'evt-wedding',
      title: {
        ru: 'Свадебная церемония',
        uz: 'Nikoh to\'yi',
        en: 'Wedding Ceremony',
        tr: 'Düğün Töreni',
      },
      description: {
        ru: 'Торжественная свадебная церемония',
        uz: 'Tantanali nikoh marosimi',
        en: 'Grand wedding ceremony',
        tr: 'Görkemli düğün töreni',
      },
      date: new Date('2026-09-15T14:00:00Z'),
      endDate: new Date('2026-09-15T23:00:00Z'),
      sortOrder: 1,
    },
  });

  const marakaEvent = await prisma.event.upsert({
    where: { id: 'evt-maraka' },
    update: {},
    create: {
      id: 'evt-maraka',
      title: {
        ru: 'Марака',
        uz: 'Maraka',
        en: 'Maraka Celebration',
        tr: 'Maraka Kutlaması',
      },
      description: {
        ru: 'Традиционная марака',
        uz: 'An\'anaviy maraka',
        en: 'Traditional Maraka celebration',
        tr: 'Geleneksel Maraka kutlaması',
      },
      date: new Date('2026-09-14T18:00:00Z'),
      endDate: new Date('2026-09-14T23:00:00Z'),
      sortOrder: 0,
    },
  });

  // Create home page with blocks
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: {
        ru: 'Главная',
        uz: 'Bosh sahifa',
        en: 'Home',
        tr: 'Ana Sayfa',
      },
      isPublished: true,
      sortOrder: 0,
      blocks: {
        create: [
          {
            type: 'HERO',
            content: {
              title: {
                ru: 'Алишан & Севинч',
                uz: 'Alishan & Sevinch',
                en: 'Alishan & Sevinch',
                tr: 'Alishan & Sevinch',
              },
              subtitle: {
                ru: 'Приглашаем вас на нашу свадьбу',
                uz: 'Sizni to\'yimizga taklif qilamiz',
                en: 'We invite you to our wedding',
                tr: 'Düğünümüze davetlisiniz',
              },
            },
            sortOrder: 0,
          },
          {
            type: 'COUNTDOWN',
            content: {
              targetDate: '2026-09-15T14:00:00Z',
              title: {
                ru: 'До свадьбы осталось',
                uz: 'To\'ygacha qoldi',
                en: 'Until the wedding',
                tr: 'Düğüne kalan süre',
              },
            },
            sortOrder: 1,
          },
          {
            type: 'COUPLE_INFO',
            content: {
              groomName: {
                ru: 'Алишан',
                uz: 'Alishan',
                en: 'Alishan',
                tr: 'Alishan',
              },
              brideName: {
                ru: 'Севинч',
                uz: 'Sevinch',
                en: 'Sevinch',
                tr: 'Sevinch',
              },
              story: {
                ru: 'Наша история любви началась...',
                uz: 'Bizning sevgi hikoyamiz boshlandi...',
                en: 'Our love story began...',
                tr: 'Aşk hikayemiz başladı...',
              },
            },
            sortOrder: 2,
          },
          {
            type: 'EVENT_LIST',
            content: {
              title: {
                ru: 'Программа мероприятий',
                uz: 'Tadbirlar dasturi',
                en: 'Event Schedule',
                tr: 'Etkinlik Programı',
              },
            },
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully');
  console.log('   Admin: admin@wedding.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
