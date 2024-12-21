export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/'''/g, '') // Удаляем три кавычки подряд
    .replace(/[^a-zа-яё0-9\s-]/g, '') // Удаляем все символы кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
}
