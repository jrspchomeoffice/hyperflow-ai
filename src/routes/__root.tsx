import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { KeyRound, UserCircle, LogIn } from "lucide-react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "../components/hyperflow/ThemeProvider";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { STORAGE_KEYS } from "../lib/hyperflow/storage";

function NotFoundComponent() {
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-7xl font-bold text-foreground">404</h1><h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2><p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p><div className="mt-6"><Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link></div></div></div>;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1><p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p><div className="mt-6 flex flex-wrap justify-center gap-2"><button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button><a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">Go home</a></div></div></div>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" },
      { title: "HyperFlow Pro" },
      { name: "description", content: "Treino guiado por IA com periodização e log de séries." },
      { name: "theme-color", content: "#070b12" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="pt-BR" className="dark"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function AppLock() {
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState("1234");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEYS.password);
    if (raw) { try { setStoredPassword(JSON.parse(raw) as string); } catch { /* keep default */ } }
  }, []);

  const unlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === storedPassword) {
      window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(true));
      window.location.reload();
    } else setError("Senha incorreta.");
  };

  return <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background px-5"><div className="panel w-full max-w-sm p-5"><div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary"><KeyRound className="size-6 text-primary-foreground" /></div><h1 className="mt-4 text-center font-display text-2xl font-bold uppercase tracking-wide">HyperFlow Pro</h1><p className="mt-1 text-center text-xs text-muted-foreground">Digite sua senha para continuar.</p><form onSubmit={unlock} className="mt-5 space-y-2"><input autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha do aplicativo" className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none focus:border-metric" />{error && <p className="text-xs text-primary">{error}</p>}<button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold uppercase text-primary-foreground"><LogIn className="size-4" /> Entrar</button></form></div></div>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [session, setSession] = useState(true);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEYS.session);
    if (raw !== null) { try { setSession(JSON.parse(raw) !== false); } catch { setSession(true); } }
  }, []);

  return <QueryClientProvider client={queryClient}><ThemeProvider><Outlet />{!session && <AppLock />}<a href="/profile" aria-label="Perfil" className="fixed bottom-4 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-secondary/95 text-foreground shadow-lg backdrop-blur"><UserCircle className="size-5" /></a></ThemeProvider></QueryClientProvider>;
}
