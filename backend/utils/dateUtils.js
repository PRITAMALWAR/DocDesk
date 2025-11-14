export const normalizeDate = (dateStr) => {
  // Expecting HTML date input 'YYYY-MM-DD' — keep as-is to avoid UTC shifting
  return dateStr;
};
export const isValidTime = (timeStr) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
export const weekdayShort = (dateStr) => {
  // Compute weekday using local time; construct Date(year, monthIndex, day)
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(dateStr);
  if (!m) return '';
  const [_, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dt.getDay()];
};
