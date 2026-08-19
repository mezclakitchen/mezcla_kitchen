import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Wheat, Eye, EyeOff, Loader2, Lock, Mail, ArrowRight, ChefHat } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Mezcla" },
      { name: "description", content: "Sign in to the Mezcla Admin Dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.navigate({ to: "/admin" });
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Please confirm your email address before signing in.");
        } else {
          setError(authError.message);
        }
        return;
      }

      await router.navigate({ to: "/admin" });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.015_30)] flex overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[oklch(0.74_0.08_75/0.06)] blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-[oklch(0.55_0.085_150/0.04)] blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[oklch(0.74_0.08_75/0.05)] blur-3xl" />
      </div>

      {/* Left — Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[520px] shrink-0 relative overflow-hidden border-r border-white/5">
        {/* Grain texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.16_0.02_30)] via-[oklch(0.12_0.015_30)] to-[oklch(0.09_0.01_30)]" />
        
        {/* Decorative food motif pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.74 0.08 75) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <img src="/logo-filled.png" alt="Mezcla Logo" className="h-12 w-auto object-contain" />
          </div>
        </div>

        <div className="relative z-10 p-10 space-y-8">
          {/* Featured Quote */}
          <div
            className={cn(
              "transition-all duration-700 delay-300",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <blockquote className="text-[oklch(0.85_0.015_70)] font-display text-2xl leading-snug">
              "Handcrafted in small batches, delivered with love."
            </blockquote>
            <cite className="block mt-4 text-sm text-[oklch(0.55_0.012_70)] not-italic">
              — The Mezcla Way
            </cite>
          </div>

          {/* Stats */}
          <div
            className={cn(
              "grid grid-cols-3 gap-4 transition-all duration-700 delay-500",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {[
              { label: "Products", value: "18+" },
              { label: "Happy Clients", value: "500+" },
              { label: "City", value: "BLR" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
              >
                <div className="font-display text-2xl text-[oklch(0.74_0.08_75)]">
                  {s.value}
                </div>
                <div className="text-xs text-[oklch(0.5_0.01_70)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature List */}
          <div
            className={cn(
              "space-y-2 transition-all duration-700 delay-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {[
              "Manage products, categories & gallery",
              "Create orders & generate PDF invoices",
              "Track customers & billing",
              "Update homepage & announcements",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-[oklch(0.55_0.012_70)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.08_75)]" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 p-10 border-t border-white/[0.05]">
          <div className="text-xs text-[oklch(0.38_0.008_70)]">
            © 2026 Mezcla — The Artisanal Kitchen · Bangalore
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <div
          className={cn(
            "w-full max-w-md transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <img src="/logo-filled.png" alt="Mezcla Logo" className="h-10 w-auto object-contain" />
          </div>

          {/* Greeting */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[oklch(0.74_0.08_75/0.1)] border border-[oklch(0.74_0.08_75/0.2)] rounded-full px-3 py-1 mb-4">
              <ChefHat className="h-3.5 w-3.5 text-[oklch(0.74_0.08_75)]" />
              <span className="text-xs text-[oklch(0.74_0.08_75)] font-medium">Admin Portal</span>
            </div>
            <h1 className="text-3xl font-display text-[oklch(0.97_0.008_70)] leading-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[oklch(0.55_0.012_70)]">
              Sign in to manage your Mezcla business
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-[oklch(0.14_0.015_30)] border border-white/[0.07] p-8 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-5" id="admin-login-form">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest text-[oklch(0.55_0.012_70)] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.45_0.01_70)]" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mezclakitchen.in"
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[oklch(0.10_0.012_30)] border border-white/[0.08] text-[oklch(0.93_0.012_70)] text-sm placeholder:text-[oklch(0.38_0.008_70)] focus:outline-none focus:border-[oklch(0.74_0.08_75/0.6)] focus:ring-1 focus:ring-[oklch(0.74_0.08_75/0.3)] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-widest text-[oklch(0.55_0.012_70)] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.45_0.01_70)]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-11 pr-12 rounded-xl bg-[oklch(0.10_0.012_30)] border border-white/[0.08] text-[oklch(0.93_0.012_70)] text-sm placeholder:text-[oklch(0.38_0.008_70)] focus:outline-none focus:border-[oklch(0.74_0.08_75/0.6)] focus:ring-1 focus:ring-[oklch(0.74_0.08_75/0.3)] transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_70)] hover:text-[oklch(0.74_0.08_75)] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-[oklch(0.56_0.18_25/0.12)] border border-[oklch(0.56_0.18_25/0.3)] px-4 py-3 text-sm text-[oklch(0.85_0.08_25)]">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[oklch(0.74_0.08_75)] text-[oklch(0.18_0.02_30)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[oklch(0.78_0.09_75)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-[oklch(0.38_0.008_70)]">secured by</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Supabase badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-[oklch(0.42_0.01_70)]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.33 12.57.696 13.4 1.372 13.4h7.517l.114.016 1.979-.033-.974 9.868c.015.986 1.26 1.41 1.874.637l9.262-11.652c.434-.52.068-1.35-.608-1.35h-7.517L11.9 1.036z" />
              </svg>
              <span>Supabase Auth</span>
              <span className="mx-1">·</span>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>256-bit encrypted</span>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-[oklch(0.38_0.008_70)]">
            Mezcla Admin · For authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
