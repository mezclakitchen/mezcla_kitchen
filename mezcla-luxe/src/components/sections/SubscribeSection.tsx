import { useState } from "react";
import { toast } from "sonner";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

export function SubscribeSection() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, source: "website" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to subscribe");
      }

      setDone(true);
      toast.success("Welcome to the Mezcla Circle!");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-espresso py-24 md:py-32 relative overflow-hidden">
      {/* Decorative watermark */}
      <div className="absolute -top-32 -right-32 text-[20rem] font-display text-cocoa/30 leading-none select-none pointer-events-none blur-sm">
        M
      </div>

      <div className="container-luxe relative z-10">
        <div className="max-w-5xl mx-auto bg-cocoa/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors duration-700">
          
          {/* Subtle top glow */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Side: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20">
                <Sparkles className="size-3" />
                From Our Kitchen to Your Inbox
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.1] mb-6">
               Never miss  <br/> 
                <span className="italic text-gold">what's baking.</span>
              </h2>
              <p className="text-ivory-muted/90 leading-relaxed text-sm md:text-base max-w-md">
                Be the first to hear about seasonal specials, workshops, festive gifting, new menu additions and exclusive community offers. 
              </p>
            </div>
            
            {/* Right Side: Form */}
            <div className="flex flex-col gap-8">
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
                {/* honeypot */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="size-5 text-ivory-muted/50" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || done}
                    placeholder="Enter your email address"
                    className="w-full pl-14 pr-5 py-4 rounded-full bg-espresso border border-white/10 text-cream placeholder:text-ivory-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50 text-sm shadow-inner"
                  />
                </div>
                
                <button type="submit" disabled={loading || done} className="w-full bg-gold text-cocoa font-bold uppercase tracking-widest text-xs py-4 rounded-full shadow-lg hover:bg-cream transition-all duration-300 disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? "Joining..." : done ? "Welcome to the Circle ✦" : "Get Early Access"}
                </button>
              </form>

              <div className="grid grid-cols-2 gap-4">
                {["Exclusive Offers", "New Launches", "Festive Slots", "No Spam"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-[0.65rem] uppercase tracking-widest text-ivory-muted/70 font-semibold">
                    <CheckCircle2 className="size-3.5 text-gold/60" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
