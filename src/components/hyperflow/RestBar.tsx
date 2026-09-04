import { useEffect, useRef } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { formatClock } from "@/lib/hyperflow/storage";
import { cn } from "@/lib/utils";

export function RestBar({
  seconds,
  total,
  running,
  finished,
  onAdd,
  onReset,
  onToggle,
}: {
  seconds: number;
  total: number;
  running: boolean;
  finished: boolean;
  onAdd: (delta: number) => void;
  onReset: () => void;
  onToggle: () => void;
}) {
  const beeped = useRef(false);

  useEffect(() => {
    if (!finished) {
      beeped.current = false;
      return;
    }
    if (beeped.current) return;
    beeped.current = true;
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([120, 60, 120]);
  }, [finished]);

  const pct = total > 0 ? Math.min(100, ((total - seconds) / total) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="h-0.5 w-full bg-secondary">
        <div
          className={cn("h-full transition-[width] duration-300", finished ? "bg-success" : "bg-metric")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mx-auto flex max-w-md items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          aria-label={running ? "Pausar descanso" : "Iniciar descanso"}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border",
            running
              ? "animate-pulse-ring border-metric/60 bg-metric/12 text-metric"
              : "border-border bg-secondary text-foreground",
          )}
        >
          {running ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            <Timer className="size-3" />
            {finished ? "Descanso concluído — próxima série" : "Descanso"}
          </p>
          <p
            className={cn(
              "font-display text-3xl leading-none font-bold tabular-nums",
              finished ? "text-success" : "text-metric",
            )}
          >
            {formatClock(seconds)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAdd(60)}
            className="rounded-lg border border-border bg-secondary px-2.5 py-2 text-[11px] font-semibold"
          >
            +60s
          </button>
          <button
            type="button"
            onClick={() => onAdd(120)}
            className="rounded-lg border border-border bg-secondary px-2.5 py-2 text-[11px] font-semibold"
          >
            +120s
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Zerar cronômetro"
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
