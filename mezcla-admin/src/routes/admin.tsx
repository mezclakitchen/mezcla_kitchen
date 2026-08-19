import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/admin/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.navigate({ to: "/login" });
      } else {
        setAuthed(true);
      }
      setChecking(false);
    });

    // Listen for auth changes (logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.navigate({ to: "/login" });
        setAuthed(false);
      } else {
        setAuthed(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
          <p className="text-sm text-muted-foreground">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="h-screen flex overflow-hidden bg-background text-foreground print:h-auto print:block print:overflow-visible">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto relative print:block print:overflow-visible">
        <Outlet />
      </div>
    </div>
  );
}
