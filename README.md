# 💒 Wedding Invitation Platform — Alishan & Sevinch

Платформа для управления свадебными приглашениями с поддержкой 4 языков.

## Архитектура

```
apps/
├── backend/    # NestJS + Prisma + PostgreSQL (API, порт 4000)
├── admin/      # React + Vite + Ant Design (Админ панель, порт 5173)
└── web/        # Next.js + Framer Motion (Сайт для гостей, порт 3000)
```

## Быстрый старт

### 1. Запуск PostgreSQL
```bash
docker compose up -d
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка базы данных
```bash
cd apps/backend
cp .env.example .env   # если нужно поменять настройки
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Запуск всех сервисов
```bash
# Из корня проекта:
npm run dev
```

Или по отдельности:
```bash
npm run dev:backend   # http://localhost:4000
npm run dev:admin     # http://localhost:5173
npm run dev:web       # http://localhost:3000
```

## Доступ

- **Админ панель:** http://localhost:5173
- **Сайт:** http://localhost:3000
- **API документация (Swagger):** http://localhost:4000/api/docs

### Логин по умолчанию
- Email: `admin@wedding.com`
- Пароль: `admin123`

## Возможности

### Управление гостями
- Добавление гостей с контактными данными
- Выбор языка для каждого гостя (RU, UZ, EN, TR)
- Отслеживание RSVP статуса
- Пищевые предпочтения

### Приглашения
- **Индивидуальные** — для одного гостя
- **С супругой** — для пары
- **Семейные** — для всей семьи
- Кастомные тексты приглашения для каждого
- Уникальная ссылка для каждого приглашения

### Мероприятия (Event Builder)
- Свадебная церемония
- Марака
- ЗАГС
- Вечеринка после свадьбы
- Любые другие мероприятия

### CMS (Конструктор страниц)
- Drag-and-drop блоки: Hero, Text, Image, Gallery, Video, Countdown, Event List, RSVP, Map, Custom HTML, Blog List, Timeline, Couple Info
- 4 языка для всего контента

### Блог / Новости
- Публикация новостей о свадьбе
- Мультиязычный контент

### Медиа библиотека
- Загрузка фотографий, видео и аудио
- Автоматические миниатюры

### Настройки сайта
- Цветовая тема
- Шрифты
- Фоновая музыка
- Социальные сети
- SEO настройки

### Роли пользователей
- **Super Admin** — полный доступ
- **Manager** — управление контентом
- **Viewer** — только просмотр

## Технологии

| Компонент | Технологии |
|-----------|-----------|
| Backend | NestJS, Prisma 7, PostgreSQL, @prisma/adapter-pg, Passport JWT, Sharp, Swagger |
| Admin | React 19, Vite, Ant Design, Zustand, React Router, Axios |
| Website | Next.js 15 (App Router), Framer Motion, Lucide Icons |
| DevOps | Docker Compose, npm Workspaces |
