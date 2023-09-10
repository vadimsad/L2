export function formatDateToDisplay(date) {
    return date.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDateToInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ноль, если месяц < 10
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatInputTimeToTimestamp(time) {
    const MINUTE = 60 * 1000;
    const HOUR = 60 * MINUTE;

    // Разделяем время и преобразуем в числа
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Проверяем, что hours и minutes являются числами
    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error('Некорректный формат времени');
    }

    // Вычисляем метку времени, учитывая часы, минуты и миллисекунды
    return hours * HOUR + minutes * MINUTE;
}

export function formatTimestampToInputTime(timestamp, timeZoneOffsetMinutes = 0) {
    const date = new Date(timestamp);

    // Получаем часы и минуты из объекта Date
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Учитываем разницу в часовых поясах
    const localHours = hours + Math.floor(timeZoneOffsetMinutes / 60);
    const localMinutes = minutes + (timeZoneOffsetMinutes % 60);

    // Форматируем часы и минуты в строку в формате "hh:mm"
    const formattedHours = String(localHours).padStart(2, '0');
    const formattedMinutes = String(localMinutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}