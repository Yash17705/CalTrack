const pad = (value) => String(value).padStart(2, '0');

export function getLocalDateString(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getLastNDates(count, from = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (count - 1 - index));
    return getLocalDateString(date);
  });
}

export function formatShortDate(dateString, locale = 'en-US') {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getMinutesSinceMidnight(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatTimeFromMinutes(totalMinutes, locale = 'en-US') {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setMinutes(totalMinutes);
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
