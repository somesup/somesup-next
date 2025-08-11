function TODAY() {
  return new Date().toISOString().slice(0, 10);
}

const KEY = 'news5min:last-visit';

function isDailyUnread() {
  try {
    return localStorage.getItem(KEY) !== TODAY();
  } catch {
    return false;
  }
}

function markDailyRead() {
  try {
    localStorage.setItem(KEY, TODAY());
  } catch {}
}

export { TODAY, isDailyUnread, markDailyRead };
