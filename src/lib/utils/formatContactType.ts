export function formatContactType(type: string): string {
  const types: Record<string, string> = {
    'whatsapp': 'WhatsApp',
    'telegram': 'Telegram',
    'phone': 'Телефон',
    'email': 'Email',
    'other': 'Другой способ связи'
  };
  
  return types[type] || type;
}
