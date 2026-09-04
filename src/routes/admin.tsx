import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Cpu,
  Dumbbell,
  KeyRound,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { DEFAULT_CONFIG, DEFAULT_EXERCISES, DEFAULT_ROUTINE } from "@/lib/hyperflow/data";
import { STORAGE_KEYS, useLocalState } from "@/lib/hyperflow/storage";
import type { AdminConfig, Anamnesis, Exercise, Routine } from "@/lib/hyperflow/types";
import { cn } from "@/lib/utils";

const PASSWORD = "admin123";
const MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "o4-mini"];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — HyperFlow Pro" },
      {
        name: "description",
        content:
          "Configuração do motor de IA, catálogo local de exercícios e simulador de geração de fichas do HyperFlow Pro.",
      },
      { property: "og:title", content: "Painel Administrativo — HyperFlow Pro" },
      {
        property: "og:description",
        content: "Calibre o treinador IA, gerencie exercícios e simule fichas de treino.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const field =
  "w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus:border-metric focus:ring-1 focus:ring-metric/40";
const label = "text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase";

function AdminPage() {
  const { value: unlocked, setValue: setUnlocked } = useLocalState(STORAGE_KEYS.admin, false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="panel p-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <KeyRound className="size-5 text-primary-foreground" />
          </span>
          <h1 className="font-display mt-3 text-2xl font-bold tracking-wide uppercase">
            Acesso restrito
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Painel de calibração do motor de treino. Informe a senha de administrador.
          </p>
          <form
            className="mt-4 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (pass === PASSWORD) {
                setUnlocked(true);
                setError("");
              } else {
                setError("Senha incorreta.");
              }
            }}
          >
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Senha"
              aria-label="Senha de administrador"
              className={field}
            />
            {error && <p className="text-xs font-medium text-primary">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold tracking-wide text-primary-foreground uppercase"
            >
              Entrar
            </button>
          </form>
          <Link to="/" className="mt-3 block text-center text-xs text-muted-foreground underline">
            Voltar ao treino
          </Link>
        </div>
      </main>
    );
  }

  return <AdminPanel onLock={() => setUnlocked(false)} />;
}

function AdminPanel({ onLock }: { onLock: () => void }) {
  const { value: config, setValue: setConfig } = useLocalState<AdminConfig>(
    STORAGE_KEYS.config,
    DEFAULT_CONFIG,
  );
  const { value: exercises, setValue: setExercises } = useLocalState<Exercise[]>(
    STORAGE_KEYS.exercises,
    DEFAULT_EXERCISES,
  );
  const { value: routine, setValue: setRoutine } = useLocalState<Routine>(
    STORAGE_KEYS.routine,
    DEFAULT_ROUTINE,
  );
  const [tab, setTab] = useState<"ia" | "catalogo" | "simulador">("ia");

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-16">
      <header className="flex items-center gap-2 pt-4">
        <Link
          to="/"
          aria-label="Voltar"
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-xl leading-none font-bold tracking-wide uppercase">
            Painel <span className="text-primary">Admin</span>
          </h1>
          <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Motor de IA • Catálogo • Simulador
          </p>
        </div>
        <button
          type="button"
          onClick={onLock}
          className="rounded-lg border border-border bg-secondary px-2.5 py-2 text-[10px] font-semibold uppercase"
        >
          Sair
        </button>
      </header>

      <nav className="mt-4 grid grid-cols-3 gap-1.5">
        {(
          [
            ["ia", "Motor IA", <Cpu className="size-3.5" key="i" />],
            ["catalogo", "Catálogo", <Dumbbell className="size-3.5" key="i" />],
            ["simulador", "Simulador", <Sparkles className="size-3.5" key="i" />],
          ] as const
        ).map(([id, text, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-semibold tracking-wide uppercase",
              tab === id
                ? "border-primary/60 bg-primary/12 text-foreground"
                : "border-border bg-secondary text-muted-foreground",
            )}
          >
            {icon}
            {text}
          </button>
        ))}
      </nav>

      {tab === "ia" && (
        <section className="panel mt-4 space-y-3 p-3">
          <h2 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-metric uppercase">
            <Brain className="size-3.5" /> Configuração do motor de IA
          </h2>
          <div>
            <p className={label}>OpenAI API Key</p>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="sk-..."
              className={cn(field, "mt-1")}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Armazenada apenas neste dispositivo (LocalStorage).
            </p>
          </div>
          <div>
            <p className={label}>Modelo</p>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className={cn(field, "mt-1")}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className={label}>System prompt do treinador</p>
            <textarea
              rows={10}
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              className={cn(field, "mt-1 leading-relaxed")}
            />
          </div>
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_CONFIG)}
            className="w-full rounded-lg border border-border bg-secondary py-2 text-[11px] font-semibold uppercase"
          >
            Restaurar prompt padrão
          </button>
        </section>
      )}

      {tab === "catalogo" && <Catalog exercises={exercises} setExercises={setExercises} />}

      {tab === "simulador" && (
        <Simulator exercises={exercises} routine={routine} setRoutine={setRoutine} />
      )}
    </main>
  );
}

const emptyExercise = (): Exercise => ({
  id: `custom-${Date.now()}`,
  name: "",
  group: "",
  muscle: "",
  videoUrl: "",
  equivalentId: null,
  cue: "",
  steps: [],
  mistakes: [],
});

function Catalog({
  exercises,
  setExercises,
}: {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}) {
  const [draft, setDraft] = useState<Exercise | null>(null);

  const save = () => {
    if (!draft || !draft.name.trim()) return;
    setExercises((prev) => {
      const exists = prev.some((e) => e.id === draft.id);
      return exists ? prev.map((e) => (e.id === draft.id ? draft : e)) : [...prev, draft];
    });
    setDraft(null);
  };

  return (
    <section className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold tracking-[0.14em] text-metric uppercase">
          Catálogo local • {exercises.length} exercícios
        </h2>
        <button
          type="button"
          onClick={() => setDraft(emptyExercise())}
          className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-primary-foreground uppercase"
        >
          <Plus className="size-3" /> Novo
        </button>
      </div>

      {draft && (
        <div className="panel space-y-2 border-primary/40 p-3">
          <p className={label}>Nome do exercício</p>
          <input
            className={field}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className={label}>Grupo muscular</p>
              <input
                className={cn(field, "mt-1")}
                value={draft.group}
                onChange={(e) => setDraft({ ...draft, group: e.target.value })}
              />
            </div>
            <div>
              <p className={label}>Músculo específico</p>
              <input
                className={cn(field, "mt-1")}
                value={draft.muscle}
                onChange={(e) => setDraft({ ...draft, muscle: e.target.value })}
              />
            </div>
          </div>
          <p className={label}>URL do vídeo MP4</p>
          <input
            className={field}
            value={draft.videoUrl}
            onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
            placeholder="https://cdn.hyperflowpro.app/media/exercises/nome.mp4"
          />
          <p className={label}>Exercício equivalente (substituição)</p>
          <select
            className={field}
            value={draft.equivalentId ?? ""}
            onChange={(e) => setDraft({ ...draft, equivalentId: e.target.value || null })}
          >
            <option value="">Nenhum</option>
            {exercises
              .filter((e) => e.id !== draft.id)
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
          </select>
          <p className={label}>Dica biomecânica</p>
          <textarea
            rows={2}
            className={field}
            value={draft.cue}
            onChange={(e) => setDraft({ ...draft, cue: e.target.value })}
          />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              className="flex-1 rounded-lg bg-primary py-2 text-[11px] font-bold uppercase text-primary-foreground"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="flex-1 rounded-lg border border-border bg-secondary py-2 text-[11px] font-semibold uppercase"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {exercises.map((e) => (
          <div key={e.id} className="panel flex items-center gap-2 p-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{e.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {e.group} • {e.muscle}
              </p>
              <p className="truncate text-[10px] text-metric">{e.videoUrl}</p>
            </div>
            <button
              type="button"
              onClick={() => setDraft(e)}
              aria-label={`Editar ${e.name}`}
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setExercises((prev) => prev.filter((x) => x.id !== e.id))}
              aria-label={`Excluir ${e.name}`}
              className="flex size-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

const emptyAnamnesis: Anamnesis = {
  name: "",
  age: "",
  weight: "",
  height: "",
  level: "intermediario",
  goal: "Hipertrofia",
  daysPerWeek: "6",
  restrictions: "",
};

function Simulator({
  exercises,
  routine,
  setRoutine,
}: {
  exercises: Exercise[];
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
}) {
  const [form, setForm] = useState<Anamnesis>(emptyAnamnesis);
  const [status, setStatus] = useState("");

  const generate = () => {
    const days = Math.max(1, Math.min(6, Number(form.daysPerWeek) || 6));
    const groups = [...new Set(exercises.map((e) => e.group))];
    const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const setCount = form.level === "iniciante" ? 3 : form.level === "avancado" ? 5 : 4;

    const generated: Routine = {
      ...routine,
      id: `sim-${Date.now()}`,
      name: `${form.goal} • ${form.name || "Aluno"} (simulado)`,
      createdAt: new Date().toISOString(),
      week: 1,
      days: Array.from({ length: days }, (_, i) => {
        const group = groups[i % groups.length] ?? "Geral";
        const pool = exercises.filter((e) => e.group === group);
        const picked = (pool.length ? pool : exercises).slice(0, 4);
        return {
          id: (labels[i] ?? `d${i}`).toLowerCase().replace("á", "a"),
          label: labels[i] ?? `D${i + 1}`,
          focus: `${group} • foco em ${form.goal.toLowerCase()}`,
          estimatedMinutes: `${35 + setCount * 3}-${45 + setCount * 3} min`,
          exercises: picked.map((e) => ({
            exerciseId: e.id,
            restSeconds: e.group === "Pernas" ? 150 : 90,
            sets: Array.from({ length: setCount }, () => ({
              reps: form.level === "avancado" ? 8 : 12,
              previous: "sem histórico",
            })),
          })),
        };
      }),
    };

    setRoutine(generated);
    setStatus(`Ficha "${generated.name}" salva no estado local e ativa no dashboard.`);
  };

  return (
    <section className="panel mt-4 space-y-3 p-3">
      <h2 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-metric uppercase">
        <Sparkles className="size-3.5" /> Simulador de geração
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Nome do aluno" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Idade" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
        <Field label="Peso (kg)" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
        <Field label="Altura (cm)" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className={label}>Nível</p>
          <select
            className={cn(field, "mt-1")}
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value as Anamnesis["level"] })}
          >
            <option value="iniciante">Iniciante</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>
        <div>
          <p className={label}>Dias por semana</p>
          <select
            className={cn(field, "mt-1")}
            value={form.daysPerWeek}
            onChange={(e) => setForm({ ...form, daysPerWeek: e.target.value })}
          >
            {["3", "4", "5", "6"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Field label="Objetivo" value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} />
      <div>
        <p className={label}>Restrições / lesões</p>
        <textarea
          rows={3}
          className={cn(field, "mt-1")}
          value={form.restrictions}
          onChange={(e) => setForm({ ...form, restrictions: e.target.value })}
          placeholder="Ex.: dor no ombro direito em elevação acima da cabeça"
        />
      </div>
      <button
        type="button"
        onClick={generate}
        className="w-full rounded-lg bg-primary py-2.5 text-[11px] font-bold tracking-wide text-primary-foreground uppercase"
      >
        Gerar e salvar ficha localmente
      </button>
      {status && (
        <p className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-xs text-foreground">
          {status}
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          setRoutine(DEFAULT_ROUTINE);
          setStatus("Rotina padrão de 12 semanas restaurada.");
        }}
        className="w-full rounded-lg border border-border bg-secondary py-2 text-[11px] font-semibold uppercase"
      >
        Restaurar rotina padrão
      </button>
    </section>
  );
}

function Field({
  label: text,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className={label}>{text}</p>
      <input className={cn(field, "mt-1")} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
