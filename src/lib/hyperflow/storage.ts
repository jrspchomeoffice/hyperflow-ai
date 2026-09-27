import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEYS = {
  exercises: "hyperflow.exercises.v2",
  routine: "hyperflow.routine.v2",
  log: "hyperflow.log",
  config: "hyperflow.config",
  admin: "hyperflow.admin.unlocked",
  swaps: "hyperflow.swaps",
  workoutDates: "hyperflow.workoutDates",
  password: "hyperflow.appPassword",
  session: "hyperflow.appSession",
} as const;

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
      if (key === STORAGE_KEYS.log && typeof value === "object" && value !== null) {
        const hasCompletedSet = Object.values(value as Record<string, { done?: boolean }>).some((entry) => entry?.done);
        if (hasCompletedSet) {
          const rawDates = window.localStorage.getItem(STORAGE_KEYS.workoutDates);
          const dates = rawDates ? (JSON.parse(rawDates) as string[]) : [];
          const today = todayKey();
          if (!dates.includes(today)) window.localStorage.setItem(STORAGE_KEYS.workoutDates, JSON.stringify([...dates, today]));
        }
      }
    } catch {
      /* storage full or unavailable */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initial), [initial]);
  return { value, setValue, hydrated, reset } as const;
}

export function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function dailyIndex(length: number) {
  const now = new Date();
  const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return ((dayNumber % length) + length) % length;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
