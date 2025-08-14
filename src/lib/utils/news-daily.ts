export const getTodayString = () => {
  return new Date().toISOString().slice(0, 10);
};

const KEY = 'news5min:last-visit';

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
