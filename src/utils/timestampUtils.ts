/**
 * Timestamp parsing and formatting utility for video URLs and players.
 * Supports:
 * - Plain seconds: "120", "120s" -> 120
 * - Units format: "2m30s", "1h15m20s", "45m" -> seconds
 * - Colon notation: "14:32", "1:14:32" -> seconds
 */

export function parseTimestamp(param?: string | null): number | undefined {
  if (!param) return undefined;
  const trimmed = param.trim().toLowerCase();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return undefined;

  // 1. Check colon format: "14:32" or "1:14:32"
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((p) => parseFloat(p));
    if (parts.some((p) => isNaN(p))) return undefined;
    if (parts.length === 2) {
      // MM:SS
      const [m, s] = parts;
      return m * 60 + s;
    }
    if (parts.length === 3) {
      // HH:MM:SS
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }
  }

  // 2. Check compound unit format: e.g. "1h20m30s", "15m45s", "90s"
  const unitRegex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/;
  const match = trimmed.match(unitRegex);
  if (match && (match[1] || match[2] || match[3])) {
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    const total = hours * 3600 + minutes * 60 + seconds;
    return total > 0 ? total : undefined;
  }

  // 3. Fallback: plain float/int
  const parsed = parseFloat(trimmed);
  return !isNaN(parsed) && parsed > 0 ? parsed : undefined;
}

export function formatTimeDisplay(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const total = Math.floor(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}
