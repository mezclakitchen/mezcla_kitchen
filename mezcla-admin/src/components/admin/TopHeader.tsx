import { Bell, Search, LogOut } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function TopHeader({ title }: { title: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.navigate({ to: "/login" });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/85 backdrop-blur px-6">
      <h1 className="font-display text-xl text-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:block w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search orders, customers, products…"
            className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-border-strong"
          />
        </div>

        <button className="relative h-9 w-9 grid place-items-center rounded-md border border-border bg-surface hover:bg-accent">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold" />
        </button>

        {/* Logout button */}
        <button
          id="logout-btn"
          title="Sign Out"
          disabled={loggingOut}
          onClick={handleLogout}
          className="h-9 w-9 grid place-items-center rounded-md border border-border bg-surface hover:bg-accent hover:text-destructive transition-colors disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md border border-border bg-surface">
          <span className="h-7 w-7 grid place-items-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
            MA
          </span>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold leading-tight">Mezcla Admin</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
