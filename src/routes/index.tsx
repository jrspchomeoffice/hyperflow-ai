import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dumbbell, Flame, Info, Layers, Lock, Quote, Settings2, Timer } from "lucide-react";
import { ExerciseCard } from "@/components/hyperflow/ExerciseCard";
import { ExerciseModal } from "@/components/hyperflow/ExerciseModal";
import { RestBar } from "@/components/hyperflow/RestBar";
import { DAILY_QUOTES, DEFAULT_EXERCISES, DEFAULT_ROUTINE } from "@/lib/hyperflow/data";
import { dailyIndex, STORAGE_KEYS, useLocalState } from "@/lib/hyperflow/storage";
import type { Exercise, Routine, WorkoutLog } from "@/lib/hyperflow/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HyperFlow Pro — Treino guiado por IA com log de séries" },
      {
        name: "description",
        content:
          "Dashboard de treino mobile-first: periodização de 12 semanas, log de séries, dicas biomecânicas e cronômetro de descanso.",
      },
      { property: "og:title", content: "HyperFlow Pro — Treino guiado por IA" },
      {
        property: "og:description",
        content:
          "Periodização de hipertrofia, tracker de séries e cronômetro de descanso em um painel atlético denso.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { value: exercises } = useLocalState<Exercise[]>(STORAGE_KEYS.exercises, DEFAULT_EXERCISES);
  const { value: routine } = useLocalState<Routine>(STORAGE_KEYS.routine, DEFAULT_ROUTINE);
  const { value: log, setValue: setLog } = useLocalState<WorkoutLog>(STORAGE_KEYS.log, {});
  const { value: swaps, setValue: setSwaps } = useLocalState<Record<string, string>>(
    STORAGE_KEYS.swaps,
    {},
  );

  const [dayId, setDayId] = useState(routine.days[0]?.id ?? "seg");
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);
  const [lockedTip, setLockedTip] = useState(false);

  const [restTotal, setRestTotal] = useState(90);
  const [restSeconds, setRestSeconds] = useState(90);
  const [restRunning, setRestRunning] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!restRunning) return;
    tick.current = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          setRestRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [restRunning]);

  const byId = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const day = routine.days.find((d) => d.id === dayId) ?? routine.days[0];
  const quote = DAILY_QUOTES[dailyIndex(DAILY_QUOTES.length)];

  const resolved = useMemo(
    () =>
      day.exercises.map((plan) => {
        const swapKey = `${day.id}:${plan.exerciseId}`;
        const activeId = swaps[swapKey] ?? plan.exerciseId;
        const exercise = byId.get(activeId) ?? byId.get(plan.exerciseId);
        return { plan, exercise, swapKey, activeId };
      }),
    [day, swaps, byId],
  );

  const totalSets = day.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const volume = useMemo(
    () =>
      Object.entries(log).reduce((sum, [key, entry]) => {
        if (!key.startsWith(`${day.id}:`) || !entry.done) return sum;
        const weight = Number.parseFloat(entry.weight);
        return sum + (Number.isFinite(weight) ? weight : 0);
      }, 0),
    [log, day.id],
  );

  const setWeight = useCallback(
    (key: string, weight: string) =>
      setLog((prev) => ({ ...prev, [key]: { weight, done: prev[key]?.done ?? false } })),
    [setLog],
  );

  const toggleDone = useCallback(
    (key: string, rest: number) => {
      setLog((prev) => {
        const current = prev[key] ?? { weight: "", done: false };
        const next = { ...current, done: !current.done };
        if (next.done) {
          setRestTotal(rest);
          setRestSeconds(rest);
          setRestRunning(true);
        }
        return { ...prev, [key]: next };
      });
    },
    [setLog],
  );

  const weekPct = (routine.week / routine.totalWeeks) * 100;

  return (
    <main className="mx-auto min-h-screen max-w-md pb-28">
      <header className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary">
            <Flame className="size-5 text-primary-foreground" />
          </span>
          <div>
            <h1 className="font-display text-xl leading-none font-bold tracking-wide uppercase">
              HyperFlow <span className="text-primary">Pro</span>
            </h1>
            <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {routine.name}
            </p>
          </div>
        </div>
        <Link
          to="/admin"
          aria-label="Painel administrativo"
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground"
        >
          <Settings2 className="size-4" />
        </Link>
      </header>

      <section className="mt-4 px-4">
        <div className="panel relative overflow-hidden p-4">
          <div
            aria-hidden
            className="absolute -top-16 -right-10 size-40 rounded-full bg-primary/15 blur-3xl"
          />
          <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            <Quote className="size-3" /> Briefing do treinador IA
          </p>
          <p className="mt-2 text-[17px] leading-snug font-semibold tracking-tight text-balance">
            {quote}
          </p>

          <div className="mt-4 rounded-lg border border-border bg-background/45 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold">
                  {routine.mesocycle} •{" "}
                  <span className="text-metric">
                    Semana {routine.week} de {routine.totalWeeks}
                  </span>
                </p>
                <p className="mt-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                  Trava de adaptação neural ativa
                </p>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLockedTip((v) => !v)}
                  className="flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1.5 text-[10px] font-semibold tracking-wide uppercase opacity-70"
                >
                  <Lock className="size-3" /> Gerar nova rotina
                </button>
              </div>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                style={{ width: `${weekPct}%` }}
              />
            </div>
            {lockedTip && (
              <p className="mt-2 flex gap-1.5 rounded-md border border-metric/25 bg-metric/8 px-2 py-1.5 text-[11px] leading-relaxed">
                <Info className="mt-0.5 size-3.5 shrink-0 text-metric" />
                A rotina fica travada por 12 semanas: adaptação neural e progressão de carga só
                aparecem com repetição do mesmo estímulo. Nova geração liberada na semana 13.
              </p>
            )}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric icon={<Timer className="size-3" />} label="Duração est." value={day.estimatedMinutes} />
            <Metric icon={<Layers className="size-3" />} label="Séries totais" value={String(totalSets)} />
            <Metric
              icon={<Dumbbell className="size-3" />}
              label="Carga acum."
              value={`${Math.round(volume)} kg`}
            />
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="hide-scrollbar flex gap-1.5 overflow-x-auto px-4">
          {routine.days.map((d) => {
            const active = d.id === day.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDayId(d.id)}
                className={cn(
                  "relative shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "border-primary/60 bg-primary/12 text-foreground"
                    : "border-border bg-secondary text-muted-foreground",
                )}
              >
                {d.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 px-4 text-[11px] font-semibold tracking-[0.14em] text-metric uppercase">
          {day.focus}
        </p>
      </section>

      <section className="mt-3 space-y-3 px-4">
        {resolved.map(({ plan, exercise, swapKey, activeId }, i) => {
          if (!exercise) return null;
          const variationId = exercise.equivalentId;
          const variation = variationId ? (byId.get(variationId) ?? null) : null;
          const logs = plan.sets.map(
            (_, si) => log[`${day.id}:${activeId}:${si}`] ?? { weight: "", done: false },
          );
          return (
            <ExerciseCard
              key={`${plan.exerciseId}-${i}`}
              plan={plan}
              exercise={exercise}
              variation={variation}
              logs={logs}
              index={i}
              onOpenModal={() => setModalExercise(exercise)}
              onSwap={() => {
                if (!variation) return;
                setSwaps((prev) => ({ ...prev, [swapKey]: variation.id }));
              }}
              onWeightChange={(si, weight) => setWeight(`${day.id}:${activeId}:${si}`, weight)}
              onToggleDone={(si, rest) => toggleDone(`${day.id}:${activeId}:${si}`, rest)}
            />
          );
        })}
      </section>

      <ExerciseModal exercise={modalExercise} onClose={() => setModalExercise(null)} />

      <RestBar
        seconds={restSeconds}
        total={restTotal}
        running={restRunning}
        finished={restSeconds === 0}
        onAdd={(delta) => {
          setRestTotal((t) => t + delta);
          setRestSeconds((s) => s + delta);
          setRestRunning(true);
        }}
        onReset={() => {
          setRestRunning(false);
          setRestSeconds(restTotal);
        }}
        onToggle={() => setRestRunning((r) => (restSeconds === 0 ? false : !r))}
      />
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/45 px-2 py-2">
      <p className="flex items-center gap-1 text-[9px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {icon}
        {label}
      </p>
      <p className="font-display mt-1 text-base leading-none font-bold text-metric">{value}</p>
    </div>
  );
}
