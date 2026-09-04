import { useState } from "react";
import { Check, ChevronDown, Lightbulb, Repeat2 } from "lucide-react";
import { ExerciseThumb } from "./ExerciseThumb";
import type { Exercise, PlannedExercise, SetLog } from "@/lib/hyperflow/types";
import { cn } from "@/lib/utils";

export function ExerciseCard({
  plan,
  exercise,
  variation,
  logs,
  index,
  onWeightChange,
  onToggleDone,
  onOpenModal,
  onSwap,
}: {
  plan: PlannedExercise;
  exercise: Exercise;
  variation: Exercise | null;
  logs: SetLog[];
  index: number;
  onWeightChange: (setIndex: number, weight: string) => void;
  onToggleDone: (setIndex: number, restSeconds: number) => void;
  onOpenModal: () => void;
  onSwap: () => void;
}) {
  const [cueOpen, setCueOpen] = useState(false);
  const doneCount = logs.filter((l) => l.done).length;

  return (
    <article className="panel p-3">
      <div className="flex gap-3">
        <div className="w-[42%] shrink-0">
          <ExerciseThumb exercise={exercise} onClick={onOpenModal} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Exercício {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-0.5 text-[15px] leading-tight font-bold tracking-tight">
                {exercise.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onSwap}
              disabled={!variation}
              title={
                variation
                  ? `Trocar por ${variation.name}`
                  : "Sem variação equivalente cadastrada"
              }
              className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-[10px] font-semibold tracking-wide uppercase transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
            >
              <Repeat2 className="size-3" />
              Variação
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
            <span className="rounded border border-border bg-background/40 px-1.5 py-0.5 text-muted-foreground">
              {plan.sets.length} séries × {plan.sets[0]?.reps ?? 10}
            </span>
            <span className="rounded border border-border bg-background/40 px-1.5 py-0.5 text-metric">
              Descanso {plan.restSeconds}s
            </span>
            <span
              className={cn(
                "rounded border px-1.5 py-0.5",
                doneCount === plan.sets.length
                  ? "border-success/60 text-success"
                  : "border-border text-muted-foreground",
              )}
            >
              {doneCount}/{plan.sets.length} feitas
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[46px_1fr_1fr_38px] items-center gap-1 border-b border-border bg-background/50 px-2 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <span>Série</span>
          <span>Anterior</span>
          <span>Carga atual</span>
          <span className="text-right">OK</span>
        </div>
        {plan.sets.map((set, i) => {
          const log = logs[i] ?? { weight: "", done: false };
          return (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[46px_1fr_1fr_38px] items-center gap-1 border-b border-border/70 px-2 py-1.5 text-[13px] last:border-b-0",
                log.done && "bg-success/8",
              )}
            >
              <span className="font-display text-base font-semibold">{i + 1}</span>
              <span className="truncate text-xs text-muted-foreground">{set.previous}</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  inputMode="decimal"
                  value={log.weight}
                  onChange={(e) => onWeightChange(i, e.target.value)}
                  placeholder="—"
                  aria-label={`Carga da série ${i + 1}`}
                  className="w-16 rounded border border-border bg-background/70 px-1.5 py-1 text-sm font-semibold tabular-nums outline-none focus:border-metric focus:ring-1 focus:ring-metric/40"
                />
                <span className="text-[10px] text-muted-foreground">kg</span>
                <span className="text-[10px] text-muted-foreground">×{set.reps}</span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onToggleDone(i, plan.restSeconds)}
                  aria-label={`Concluir série ${i + 1}`}
                  aria-pressed={log.done}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border transition-colors",
                    log.done
                      ? "animate-pop-check border-success bg-success text-background"
                      : "border-border bg-background/60 text-transparent hover:border-success/70",
                  )}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setCueOpen((v) => !v)}
        className="mt-2 flex w-full items-center gap-2 rounded-lg border border-border bg-background/40 px-2.5 py-2 text-left"
      >
        <Lightbulb className="size-3.5 shrink-0 text-accent" />
        <span className="flex-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Dica biomecânica da IA
        </span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", cueOpen && "rotate-180")}
        />
      </button>
      {cueOpen && (
        <p className="mt-1.5 rounded-lg border border-accent/25 bg-accent/8 px-2.5 py-2 text-xs leading-relaxed text-foreground/90">
          {exercise.cue}
        </p>
      )}
    </article>
  );
}
