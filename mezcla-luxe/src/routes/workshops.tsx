import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { FAQSection } from "@/components/sections/FAQSection";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { Sparkles, ChefHat, Clock, Users, CheckCircle2, Minus } from "lucide-react";
import cateringImg from "@/assets/cat-catering.jpg";

export const Route = createFileRoute("/workshops")({
  head: () => ({
    meta: [
      { title: "Food & Baking Workshops in Bangalore | Mezcla" },
      { name: "description", content: "Hands-on baking and food workshops in Bangalore—sourdough, pizza making, mezze boards and more. Intimate, fun and delicious experiences with Team Mezcla." },
      { property: "og:image", content: cateringImg },
    ],
    links: [{ rel: "canonical", href: "/workshops" }],
  }),
  component: WorkshopsPage,
});

const workshopTypes = [
  { t: "Sourdough Baking", d: "Learn to make naturally fermented sourdough from scratch—starter, shaping, scoring and baking." },
  { t: "Mezze & Dips Board", d: "Craft a stunning spread with homemade hummus, muhammara, pesto and accompaniments." },
  { t: "Pizza Making", d: "Hand-stretch, top and bake your own pizza in a fun, social session for groups and team outings." },
  { t: "Brownies & Bakes", d: "A sweet session—make fudgy brownies, butter biscuits and a seasonal bake to take home." },
  { t: "Grazing Board Styling", d: "Learn the art of building a beautiful, abundant grazing board. Perfect for hosts." },
  { t: "Corporate Team Workshop", d: "A fun, customisable food experience for teams, offsites and corporate bonding." },
];

const includes = [
  "All ingredients and equipment provided",
  "Step-by-step guidance from Team Mezcla",
  "You take home everything you make",
  "Light refreshments during the session",
];
const notIncluded = [
  "Venue (workshops hosted at our kitchen or your space)",
  "Sessions below minimum group size of 8",
  "Same-week bookings (1 week notice required)",
];

function WorkshopsPage() {
  const { generateWhatsAppLink } = useWhatsApp();

  const [form, setForm] = useState({
    type: "Sourdough Baking",
    groupSize: "8–15 people",
    preference: "Weekends preferred",
    date: "",
    notes: "",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Hi Mezcla! I'd like to book a Workshop.\n\n` +
      `Workshop Type: ${form.type}\nGroup Size: ${form.groupSize}\n` +
      `Timing Preference: ${form.preference}\nPreferred Date: ${form.date}\n\nNotes: ${form.notes}`;
    window.open(generateWhatsAppLink(msg), "_blank");
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-espresso overflow-hidden min-h-[90vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          <div className="hidden lg:block bg-gradient-to-r from-espresso via-espresso/95 to-transparent z-10" />
          <div className="absolute inset-0 bg-espresso/80 lg:hidden z-10" />
          <div className="absolute inset-0 lg:left-[40%]">
            <img src={cateringImg} alt="Food Workshops" className="size-full object-cover opacity-50 lg:opacity-90" />
            <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-espresso to-transparent" />
          </div>
        </div>
        <div className="container-luxe relative z-20 w-full pt-40 pb-24 lg:py-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20 backdrop-blur-md">
              <ChefHat className="size-3" />
              Hands-on & Delicious
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] tracking-tight">
              Learn. Make. <br />
              <span className="italic text-gold font-light">Eat together.</span>
            </h1>
            <p className="mt-8 text-ivory-muted/90 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              Intimate, hands-on workshops in Bangalore—sourdough, pizza, mezze boards and more. Perfect for curious food lovers, small groups and team outings.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#book" className="px-8 py-4 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                Book a Workshop
              </a>
              <a href="#types" className="px-8 py-4 border border-white/20 text-cream hover:border-gold hover:text-gold font-bold uppercase tracking-widest text-xs rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                Explore Sessions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-cocoa border-b border-white/5">
        <div className="container-luxe py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:p-8 md:p-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { icon: <Users className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "8–20", label: "Group Size" },
              { icon: <Clock className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "2–3 hrs", label: "Session Duration" },
              { icon: <ChefHat className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Hands-on", label: "Learning Style" },
              { icon: <Sparkles className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Custom", label: "Group Bookings" },
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4 pt-4 md:pt-0">
                {m.icon}
                <p className="font-display text-2xl text-cream mb-1">{m.val}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeader eyebrow="The Process" title="Simple, fun and delicious." align="center" />
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {["Tell us your group size & preferred session", "We confirm a date and send details", "Show up with an appetite", "Cook, eat and go home inspired"].map((s, i) => (
              <div key={s} className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white border border-border hover:border-gold/30 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-9xl font-display text-ink/[0.03] group-hover:text-gold/[0.08] transition-colors leading-none select-none">{i + 1}</div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-xs font-bold uppercase tracking-widest text-gold-deep mb-6">Step 0{i + 1}</span>
                  <p className="font-display text-xl lg:text-2xl text-ink leading-snug">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Types */}
      <section id="types" className="bg-cocoa py-24 md:py-32 border-y border-white/5">
        <div className="container-luxe">
          <SectionHeader eyebrow="Sessions" title="Pick your experience." dark />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {workshopTypes.map((s) => (
              <div key={s.t} className="rounded-3xl bg-espresso border border-white/5 p-6 sm:p-8 md:p-10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 group">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gold/70 mb-4">Workshop</p>
                <h3 className="font-display text-2xl text-cream group-hover:text-gold transition-colors">{s.t}</h3>
                <p className="mt-4 text-ivory-muted/80 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-luxe grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-white border border-gold/20 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="size-32 text-gold-deep" /></div>
            <div className="relative z-10">
              <p className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs font-bold uppercase tracking-widest text-gold-deep mb-6">Included</p>
              <h3 className="font-display text-3xl md:text-4xl text-ink">What's part of every session</h3>
              <ul className="mt-10 space-y-5">
                {includes.map((i) => (
                  <li key={i} className="flex gap-4 text-base md:text-lg text-ink-muted items-start">
                    <CheckCircle2 className="size-6 text-gold-deep shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-ink/[0.02] border border-border">
            <p className="inline-block px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-xs font-bold uppercase tracking-widest text-ink-muted/80 mb-6">Honest Note</p>
            <h3 className="font-display text-3xl md:text-4xl text-ink/80">Good to know</h3>
            <ul className="mt-10 space-y-5">
              {notIncluded.map((i) => (
                <li key={i} className="flex gap-4 text-base md:text-lg text-ink-muted/70 items-start">
                  <Minus className="size-6 text-ink/20 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="bg-espresso py-24 md:py-32">
        <div className="container-luxe max-w-4xl">
          <div className="text-center mb-16">
            <p className="eyebrow !text-gold mb-4">Book a Session</p>
            <h2 className="font-display text-4xl md:text-6xl text-cream">Reserve your spot.</h2>
          </div>
          <form onSubmit={onSubmit} className="bg-cocoa/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <Field label="Workshop Type">
                <select value={form.type} onChange={(e) => update("type", e.target.value)} className="luxe-input">
                  {["Sourdough Baking", "Mezze & Dips Board", "Pizza Making", "Brownies & Bakes", "Grazing Board Styling", "Corporate Team Workshop"].map((o) => (
                    <option key={o} className="bg-cocoa">{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Group Size">
                <select value={form.groupSize} onChange={(e) => update("groupSize", e.target.value)} className="luxe-input">
                  {["8–15 people", "15–25 people", "25+ people (corporate)"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Timing Preference">
                <select value={form.preference} onChange={(e) => update("preference", e.target.value)} className="luxe-input">
                  {["Weekends preferred", "Weekdays preferred", "Flexible", "Corporate offsite (we come to you)"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Preferred Date">
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="luxe-input" required />
              </Field>
              <Field label="Additional Notes" full>
                <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} className="luxe-input" placeholder="Any dietary needs, goals or special requests?" />
              </Field>
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 pt-6">
                <button type="submit" className="w-full sm:w-auto px-10 py-5 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                  Send Enquiry via WhatsApp
                </button>
                <p className="text-xs text-ivory-muted/50 uppercase tracking-widest">We confirm within 24 hours.</p>
              </div>
            </div>
          </form>
        </div>
      </section>

      <FAQSection category="workshops" />

      <style>{`
        .luxe-input { width:100%; padding:1rem 1.25rem; border-radius:1rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); color:var(--color-cream); font-size:0.95rem; transition:all 0.3s ease; }
        .luxe-input::placeholder { color:rgba(255,255,255,0.2); }
        .luxe-input:focus { outline:none; border-color:var(--color-gold); background:rgba(255,255,255,0.05); box-shadow:0 0 0 1px var(--color-gold); }
      `}</style>
    </>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`${full ? "md:col-span-2" : ""} block`}>
      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-ivory-muted/60 block mb-3 pl-2">{label}</span>
      {children}
    </label>
  );
}
