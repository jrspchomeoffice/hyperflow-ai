import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, KeyRound, LogOut, Moon, ShieldCheck, Sun, Trophy, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useTheme, type Theme } from "@/components/hyperflow/ThemeProvider";
import { STORAGE_KEYS, todayKey, useLocalState } from "@/lib/hyperflow/storage";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — HyperFlow Pro" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { value: dates } = useLocalState<string[]>(STORAGE_KEYS.workoutDates, []);
  const { value: password, setValue: setPassword } = useLocalState<string>(STORAGE_KEYS.password, "1234");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const savePassword = () => {
    if (newPassword.length < 4) return setMessage("A senha precisa ter pelo menos 4 caracteres.");
    if (newPassword !== confirmPassword) return setMessage("As senhas não conferem.");
    setPassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Senha alterada com sucesso.");
  };

  const logout = () => {
    window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(false));
    window.location.href = "/";
  };

  const last30 = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (29 - index));
    return date.toISOString().slice(0, 10);
  });

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-10">
      <header className="flex items-center gap-3 pt-4">
        <Link to="/" aria-label="Voltar" className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide">Perfil</h1>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Sua conta e preferências</p>
        </div>
      </header>

      <section className="panel mt-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary"><Trophy className="size-6" /></div>
          <div><p className="text-sm font-bold">Trilha de treino</p><p className="text-xs text-muted-foreground">{dates.length} dias de treino registrados</p></div>
        </div>
        <div className="mt-4 grid grid-cols-10 gap-1.5">
          {last30.map((date) => {
            const trained = dates.includes(date);
            return <div key={date} title={date} className={`aspect-square rounded-md border ${trained ? "border-primary bg-primary" : "border-border bg-secondary"}`} aria-label={`${date}: ${trained ? "treinou" : "sem treino"}`} />;
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>Últimos 30 dias</span><span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-primary" /> Treino concluído</span></div>
      </section>

      <section className="panel mt-3 p-4">
        <div className="flex items-center gap-2"><CalendarDays className="size-4 text-metric" /><h2 className="text-xs font-bold uppercase tracking-wide">Histórico</h2></div>
        <div className="mt-3 space-y-2">
          {dates.length === 0 ? <p className="text-xs text-muted-foreground">Seu histórico aparecerá aqui quando você concluir uma série.</p> : dates.slice().reverse().slice(0, 8).map((date) => <div key={date} className="flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2 text-xs"><span>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`))}</span><Check className="size-3.5 text-primary" /></div>)}
        </div>
      </section>

      <section className="panel mt-3 p-4">
        <div className="flex items-center gap-2"><Sun className="size-4 text-metric" /><h2 className="text-xs font-bold uppercase tracking-wide">Aparência</h2></div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["light", "dark"] as Theme[]).map((option) => {
            const active = theme === option;
            const Icon = option === "light" ? Sun : Moon;
            return <button key={option} type="button" onClick={() => setTheme(option)} aria-pressed={active} className={`rounded-xl border p-3 text-left ${active ? "border-primary bg-primary/10" : "border-border bg-secondary"}`}><Icon className="size-4" /><p className="mt-2 text-xs font-bold">{option === "light" ? "Modo claro" : "Modo escuro"}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{active ? "Ativo" : "Selecionar"}</p></button>;
          })}
        </div>
      </section>

      <section className="panel mt-3 p-4">
        <div className="flex items-center gap-2"><KeyRound className="size-4 text-metric" /><h2 className="text-xs font-bold uppercase tracking-wide">Senha do aplicativo</h2></div>
        <p className="mt-1 text-[10px] text-muted-foreground">Altere a senha usada para entrar no HyperFlow neste dispositivo.</p>
        <div className="mt-3 space-y-2">
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova senha" className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus:border-metric" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar nova senha" className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus:border-metric" />
          <button type="button" onClick={savePassword} className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold uppercase text-primary-foreground">Salvar nova senha</button>
          {message && <p className="text-xs text-muted-foreground">{message}</p>}
        </div>
      </section>

      <button type="button" onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-3 text-xs font-bold uppercase text-primary"><LogOut className="size-4" /> Sair do aplicativo</button>
      <p className="mt-3 text-center text-[10px] text-muted-foreground"><ShieldCheck className="mr-1 inline size-3" />Preferências e histórico são armazenados neste dispositivo.</p>
    </main>
  );
}
