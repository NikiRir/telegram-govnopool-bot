/**
 * Список городов Республики Татарстан и автокоррекция
 */
const TATARSTAN_CITIES = [
    'Казань', 'Набережные Челны', 'Нижнекамск', 'Альметьевск', 'Зеленодольск',
    'Бугульма', 'Елабуга', 'Лениногорск', 'Чистополь', 'Азнакаево',
    'Буинск', 'Мамадыш', 'Менделеевск', 'Тетюши', 'Агрыз',
    'Арск', 'Болгар', 'Верхний Услон', 'Высокая Гора', 'Заинск',
    'Иннополис', 'Кукмор', 'Лаишево', 'Муслюмово', 'Нурлат',
    'Пестрецы', 'Рыбная Слобода', 'Спасск', 'Ютазы'
];

const CITY_CORRECTIONS = {
    'чылны': 'Набережные Челны',
    'челны': 'Набережные Челны',
    'наб.челны': 'Набережные Челны',
    'наб челны': 'Набережные Челны',
    'мослим': 'Муслюмово',
    'мослимнэн': 'Муслюмово',
    'казан': 'Казань',
    'елабуга': 'Елабуга',
    'елабужка': 'Елабуга',
    'алмет': 'Альметьевск',
    'альмет': 'Альметьевск',
    'нкамск': 'Нижнекамск',
    'нижнекамск': 'Нижнекамск',
    'зеленка': 'Зеленодольск',
    'бугуль': 'Бугульма',
    'чистополь': 'Чистополь',
    'лениногорск': 'Лениногорск'
};

/**
 * Автокоррекция контактов
 */
const CONTACT_CORRECTIONS = {
    'ватсап': 'WhatsApp 📱',
    'вацап': 'WhatsApp 📱',
    'ватцап': 'WhatsApp 📱',
    'whatsapp': 'WhatsApp 📱',
    'watts': 'WhatsApp 📱',
    'вотсап': 'WhatsApp 📱',
    'vatsap': 'WhatsApp 📱',
    'вк': 'ВКонтакте 📘',
    'vk': 'ВКонтакте 📘',
    'vkontakte': 'ВКонтакте 📘',
    'вконтакте': 'ВКонтакте 📘',
    'одноклассники': 'Одноклассники 🟠',
    'ок': 'Одноклассники 🟠',
    'ok': 'Одноклассники 🟠',
    'одн': 'Одноклассники 🟠',
    'инста': 'Instagram 📷',
    'инстаграм': 'Instagram 📷',
    'instagram': 'Instagram 📷',
    'inst': 'Instagram 📷',
    'телега': 'Telegram 📨',
    'телеграм': 'Telegram 📨',
    'telegram': 'Telegram 📨',
    'тг': 'Telegram 📨'
};

/**
 * Автокоррекция городов Татарстана
 */
function correctCity(input) {
    const normalized = input.toLowerCase().trim();
    
    // Проверяем автокоррекцию
    if (CITY_CORRECTIONS[normalized]) {
        return {
            corrected: true,
            city: CITY_CORRECTIONS[normalized],
            original: input
        };
    }
    
    // Проверяем точное совпадение
    const exactMatch = TATARSTAN_CITIES.find(city => 
        city.toLowerCase() === normalized
    );
    
    if (exactMatch) {
        return {
            corrected: false,
            city: exactMatch,
            original: input
        };
    }
    
    // Проверяем частичное совпадение
    const partialMatch = TATARSTAN_CITIES.find(city => 
        city.toLowerCase().includes(normalized) || 
        normalized.includes(city.toLowerCase())
    );
    
    if (partialMatch) {
        return {
            corrected: true,
            city: partialMatch,
            original: input
        };
    }
    
    return {
        corrected: false,
        city: null,
        original: input
    };
}

/**
 * Автокоррекция контактов
 */
function correctContact(input) {
    let corrected = input;
    let wasCorrected = false;
    
    // Ищем ключевые слова и заменяем их
    for (const [key, value] of Object.entries(CONTACT_CORRECTIONS)) {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        if (regex.test(corrected)) {
            corrected = corrected.replace(regex, value);
            wasCorrected = true;
        }
    }
    
    return {
        corrected: wasCorrected,
        contact: corrected,
        original: input
    };
}

/**
 * Валидация времени
 */
function validateTime(timeStr) {
    const timePattern = /(\d{1,2}):(\d{2})/;
    const match = timeStr.match(timePattern);
    
    if (!match) {
        return {
            isValid: false,
            error: 'Неверный формат времени. Используйте ЧЧ:ММ (например: 15:30)'
        };
    }
    
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    
    if (hours < 0 || hours > 23) {
        return {
            isValid: false,
            error: 'Часы должны быть от 00 до 23'
        };
    }
    
    if (minutes < 0 || minutes > 59) {
        return {
            isValid: false,
            error: 'Минуты должны быть от 00 до 59'
        };
    }
    
    return {
        isValid: true,
        hours: hours,
        minutes: minutes
    };
}

/**
 * Форматирование даты и времени
 */
function formatDateTime(input) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = today.toLocaleDateString('ru-RU');
    const tomorrowStr = tomorrow.toLocaleDateString('ru-RU');
    
    const normalized = input.toLowerCase().trim();
    
    // Извлекаем время
    const timePattern = /(\d{1,2}):(\d{2})/;
    const timeMatch = input.match(timePattern);
    
    if (!timeMatch) {
        return {
            isValid: false,
            error: 'Укажите время в формате ЧЧ:ММ'
        };
    }
    
    // Валидируем время
    const timeValidation = validateTime(timeMatch[0]);
    if (!timeValidation.isValid) {
        return timeValidation;
    }
    
    const timeStr = `${String(timeValidation.hours).padStart(2, '0')}:${String(timeValidation.minutes).padStart(2, '0')}`;
    
    // Определяем дату
    if (normalized.includes('сегодня')) {
        return {
            isValid: true,
            formatted: `${todayStr} в ${timeStr}`
        };
    } else if (normalized.includes('завтра')) {
        return {
            isValid: true,
            formatted: `${tomorrowStr} в ${timeStr}`
        };
    } else {
        // Оставляем как есть, но с исправленным временем
        const withoutTime = input.replace(timePattern, '').trim();
        return {
            isValid: true,
            formatted: `${withoutTime} в ${timeStr}`.trim()
        };
    }
}

/**
 * Валидация контактных данных
 */
function validateContact(contact) {
    if (!contact || contact.trim().length < 2) {
        return {
            isValid: false,
            error: 'Контакт слишком короткий'
        };
    }
    
    const cleanContact = contact.trim();
    
    // Проверка на телефон
    const phonePattern = /^[\+]?[78]?[\s\-\(\)]?[0-9\s\-\(\)]{7,15}$/;
    if (phonePattern.test(cleanContact.replace(/\s/g, ''))) {
        return { isValid: true };
    }
    
    // Проверка на username Telegram
    if (cleanContact.startsWith('@') && cleanContact.length > 3) {
        return { isValid: true };
    }
    
    // Проверка на ссылку Telegram
    if (cleanContact.includes('t.me/') || cleanContact.includes('telegram.me/')) {
        return { isValid: true };
    }
    
    // Проверка на социальные сети
    if (cleanContact.includes('vk.com/') || cleanContact.includes('ok.ru/') || cleanContact.includes('wa.me/')) {
        return { isValid: true };
    }
    
    // Проверка на простой текст (имя)
    if (cleanContact.length >= 2 && /^[а-яёa-z\s0-9📱📘🟠📷📨\+\-\(\)]+$/i.test(cleanContact)) {
        return { isValid: true };
    }
    
    return {
        isValid: false,
        error: 'Укажите телефон, @username, ссылку или мессенджер'
    };
}

module.exports = {
    correctCity,
    correctContact,
    validateTime,
    formatDateTime,
    validateContact,
    TATARSTAN_CITIES
};
