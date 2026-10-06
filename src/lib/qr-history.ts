export interface QRHistoryEntry {
  shortCode: string;
  targetUrl: string;
  createdAt: string; // ISO timestamp
}

const STORAGE_KEY = "snapqr_history";
const MAX_ENTRIES = 100;

export function getQRHistory(): QRHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function addQRHistoryEntry(entry: QRHistoryEntry): void {
  const history = getQRHistory();
  // Avoid duplicates by shortCode
  if (history.some((h) => h.shortCode === entry.shortCode)) return;
  // Prepend newest first, cap at MAX_ENTRIES
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getQRHistoryShortCodes(): string[] {
  return getQRHistory().map((e) => e.shortCode);
}
