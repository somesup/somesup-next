const KEY = 'news5min:last-visit';

export const getTodayString = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

export const isDailyUnread = () => {
  try {
    return localStorage.getItem(KEY) !== getTodayString();
  } catch {
    return false;
  }
};

export const markDailyRead = () => {
  try {
    localStorage.setItem(KEY, getTodayString());
  } catch {}
};
