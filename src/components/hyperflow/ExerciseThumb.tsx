import { Play } from "lucide-react";
import type { Exercise } from "@/lib/hyperflow/types";
import { cn } from "@/lib/utils";

const GROUP_TINT: Record<string, string> = {
  Peito: "from-primary/25 via-surface to-surface-2",
  Ombro: "from-accent/25 via-surface to-surface-2",
  Tríceps: "from-primary/20 via-surface to-surface-2",
  Costas: "from-metric/20 via-surface to-surface-2",
  Pernas: "from-accent/20 via-surface to-surface-2",
  Bíceps: "from-metric/15 via-surface to-surface-2",
  Core: "from-success/20 via-surface to-surface-2",
};

export function ExerciseThumb({
  exercise,
  onClick,
  className,
}: {
  exercise: Exercise;
  onClick?: () => void;
  className?: string;
}) {
  const tint = GROUP_TINT[exercise.group] ?? "from-metric/20 via-surface to-surface-2";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver execução de ${exercise.name}`}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-linear-to-br text-left",
        tint,
        className,
      )}
    >
      <img
        src={exercise.videoUrl}
        alt={`Animação de execução: ${exercise.name}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      <span className="absolute top-2 left-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-primary-foreground uppercase">
        {exercise.group}
      </span>
      <span className="absolute bottom-2 left-2 max-w-[80%] truncate text-[11px] font-medium text-muted-foreground">
        {exercise.muscle}
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/55 backdrop-blur-sm transition-transform group-active:scale-95">
          <Play className="size-4 translate-x-px text-metric" />
        </span>
      </span>
    </button>
  );
}
