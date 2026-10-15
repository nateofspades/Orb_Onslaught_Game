export const HIGH_SCORE_KEY = 'pang.highScore';
export function readHighScore(storage) {
  try {
    const raw = storage?.getItem(HIGH_SCORE_KEY);
    if (raw === null || raw === '') return 0;
    const score = Number(raw);
    return Number.isSafeInteger(score) && score >= 0 ? score : 0;
  } catch {
    return 0;
  }
}

export function writeHighScore(storage, score) {
  if (!Number.isSafeInteger(score) || score < 0) return false;
  try { storage?.setItem(HIGH_SCORE_KEY, String(score)); return Boolean(storage); }
  catch { return false; }
}
