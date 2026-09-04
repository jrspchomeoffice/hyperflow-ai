import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEYS = {
  exercises: "hyperflow.exercises",
  routine: "hyperflow.routine",
  log: "hyperflow.log",
  config: "hyperflow.config",
  admin: "hyperflow.admin.unlocked",
  swaps: "hyperflow.swaps",
} as const;

/**
 * LocalStorage-backed state. Reads happen after hydration to keep SSR markup
 * stable, then the stored value replaces the default.
 */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* corrupted entry — keep default */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return { value, setValue, hydrated, reset } as const;
}

export function dailyIndex(length: number) {
  const now = new Date();
  const dayNumber = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000,
  );
  return ((dayNumber % length) + length) % length;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
