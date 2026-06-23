export function getHighScore(key: string): number {
  try {
    return Number(localStorage.getItem(`highscore:${key}`)) || 0;
  } catch {
    return 0;
  }
}

export function setHighScore(key: string, score: number): boolean {
  const current = getHighScore(key);
  if (score <= current) return false;
  try {
    localStorage.setItem(`highscore:${key}`, String(score));
    return true;
  } catch {
    return false;
  }
}

export function setBestLowScore(key: string, score: number): boolean {
  const current = getHighScore(key);
  if (current > 0 && score >= current) return false;
  try {
    localStorage.setItem(`highscore:${key}`, String(score));
    return true;
  } catch {
    return false;
  }
}

export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
