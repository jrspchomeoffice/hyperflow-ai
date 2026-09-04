import { AlertTriangle, ListOrdered, X } from "lucide-react";
import { useEffect } from "react";
import type { Exercise } from "@/lib/hyperflow/types";

export function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!exercise) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [exercise, onClose]);

  if (!exercise) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Execução de ${exercise.name}`}
      className="fixed inset-0 z-50 flex flex-col bg-background/97 backdrop-blur-sm"
    >
      <header className="flex items-start gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
            {exercise.group} • {exercise.muscle}
          </p>
          <h2 className="mt-0.5 truncate text-lg font-bold tracking-tight">{exercise.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl border border-border bg-linear-to-br from-primary/20 via-surface to-surface-2">
          <video
            className="size-full object-cover"
            src={exercise.videoUrl}
            playsInline
            muted
            loop
            autoPlay
            controls
          />
          <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-background/70 px-2 py-0.5 text-[10px] text-muted-foreground">
            Animação de execução
          </span>
        </div>

        <section className="panel mt-4 p-3">
          <h3 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-metric uppercase">
            <ListOrdered className="size-3.5" /> Execução passo a passo
          </h3>
          <ol className="mt-2 space-y-2">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="font-display mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-metric/50 text-xs font-bold text-metric">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel mt-3 border-primary/30 p-3">
          <h3 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            <AlertTriangle className="size-3.5" /> Erros mais comuns a evitar
          </h3>
          <ul className="mt-2 space-y-1.5">
            {exercise.mistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {m}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-3 rounded-lg border border-accent/25 bg-accent/8 px-3 py-2 text-xs leading-relaxed">
          <strong className="text-accent">Dica do treinador:</strong> {exercise.cue}
        </p>
      </div>
    </div>
  );
}
