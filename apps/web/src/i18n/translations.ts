export type Lang = 'ru' | 'uz' | 'en' | 'tr';

export const languages: { code: Lang; name: string; flag: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

export function t(obj: any, lang: Lang): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['ru'] || obj['en'] || Object.values(obj)[0] || '';
}

const translations: Record<string, Record<Lang, string>> = {
  'nav.home': { ru: 'Главная', uz: 'Bosh sahifa', en: 'Home', tr: 'Ana Sayfa' },
  'nav.blog': { ru: 'Блог', uz: 'Blog', en: 'Blog', tr: 'Blog' },
  'countdown.days': { ru: 'Дней', uz: 'Kun', en: 'Days', tr: 'Gün' },
  'countdown.hours': { ru: 'Часов', uz: 'Soat', en: 'Hours', tr: 'Saat' },
  'countdown.minutes': { ru: 'Минут', uz: 'Daqiqa', en: 'Minutes', tr: 'Dakika' },
  'countdown.seconds': { ru: 'Секунд', uz: 'Soniya', en: 'Seconds', tr: 'Saniye' },
  'rsvp.accept': { ru: 'Принять', uz: 'Qabul qilish', en: 'Accept', tr: 'Kabul Et' },
  'rsvp.decline': { ru: 'Отклонить', uz: 'Rad etish', en: 'Decline', tr: 'Reddet' },
  'rsvp.maybe': { ru: 'Возможно', uz: 'Balki', en: 'Maybe', tr: 'Belki' },
  'rsvp.message': { ru: 'Сообщение', uz: 'Xabar', en: 'Message', tr: 'Mesaj' },
  'rsvp.dietary': { ru: 'Пищевые предпочтения', uz: 'Ovqatlanish talablari', en: 'Dietary preferences', tr: 'Diyet tercihleri' },
  'rsvp.submit': { ru: 'Отправить', uz: 'Yuborish', en: 'Submit', tr: 'Gönder' },
  'rsvp.thankYou': { ru: 'Спасибо за ваш ответ!', uz: "Javobingiz uchun rahmat!", en: 'Thank you for your response!', tr: 'Yanıtınız için teşekkürler!' },
  'invite.you_are_invited': { ru: 'Вы приглашены!', uz: 'Siz taklif etildingiz!', en: 'You are invited!', tr: 'Davetlisiniz!' },
  'invite.events': { ru: 'Мероприятия', uz: 'Tadbirlar', en: 'Events', tr: 'Etkinlikler' },
  'invite.guests': { ru: 'Гости', uz: 'Mehmonlar', en: 'Guests', tr: 'Misafirler' },
  'blog.readMore': { ru: 'Читать далее', uz: "Batafsil o'qish", en: 'Read more', tr: 'Devamını oku' },
  'music.play': { ru: 'Играть', uz: "O'ynash", en: 'Play', tr: 'Oynat' },
  'music.pause': { ru: 'Пауза', uz: "To'xtatish", en: 'Pause', tr: 'Duraklat' },
};

export function i18n(key: string, lang: Lang): string {
  return translations[key]?.[lang] || translations[key]?.['en'] || key;
}
