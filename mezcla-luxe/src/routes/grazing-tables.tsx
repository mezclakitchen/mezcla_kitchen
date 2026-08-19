import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { FAQSection } from "@/components/sections/FAQSection";
import { usePublicGallery } from "@/hooks/usePublicApi";
import { X, Sparkles, Users, Clock, MapPin, Diamond } from "lucide-react";

export const Route = createFileRoute("/grazing-tables")({
  head: () => ({
    meta: [
      { title: "Grazing Tables in Bangalore — Birthdays, Parties & Events | Mezcla" },
      {
        name: "description",
        content:
          "Beautifully styled grazing tables across Bangalore. From 15 to 100 guests. Every table individually designed, delivered and set up at your venue.",
      },
      { property: "og:title", content: "Grazing Tables in Bangalore | Mezcla" },
      { property: "og:description", content: "Where great food becomes the centrepiece of every celebration." },
      { property: "og:image", content: "/product_photos/dips-platter/dips1.jpg" },
    ],
    links: [{ rel: "canonical", href: "/grazing-tables" }],
  }),
  component: GrazingPage,
});

const occasions = [
  "Birthday Parties", "Baby Showers", "Bridal Showers", "Anniversaries",
  "House Parties", "Corporate Events", "Team Celebrations", "Festive Gatherings",
  "Brunches", "Kitty Parties",
];

const curationItems = [
  { emoji: "🥖", label: "Artisan breads & crackers" },
  { emoji: "🧀", label: "Premium cheeses" },
  { emoji: "🥙", label: "Freshly prepared dips & mezze" },
  { emoji: "🥐", label: "Savoury bakes" },
  { emoji: "🍓", label: "Seasonal fruits" },
  { emoji: "🥜", label: "Nuts & accompaniments" },
  { emoji: "🍪", label: "Handcrafted desserts" },
  { emoji: "🌿", label: "Fresh garnishes" },
];

const howItWorks = [
  { title: "Tell us about your event", desc: "Share your date, venue, guest count and any dietary preferences." },
  { title: "We design your menu", desc: "We'll curate a menu that complements your occasion, style and budget." },
  { title: "We style the table", desc: "Everything is arranged beautifully on-site so it's ready before your guests arrive." },
  { title: "You enjoy the celebration", desc: "No rushing. No last-minute preparation. Just great food and great company." },
];

const whyDifferent = [
  { title: "Freshly prepared", desc: "Every element is made fresh for your event." },
  { title: "Fully customised", desc: "Every grazing table is designed around your occasion and preferences." },
  { title: "Beautifully styled", desc: "We believe presentation is just as important as flavour." },
  { title: "Vegetarian & Eggless", desc: "A menu that's inclusive without compromising on variety or taste." },
  { title: "Premium ingredients", desc: "Quality cheeses, artisan breads, fresh produce and handcrafted accompaniments." },
];

const faqs = [
  {
    q: "What does a grazing table typically include?",
    a: "Every grazing table is customised, but it may feature a selection of artisan breads, handcrafted dips, premium cheeses, fresh fruits, savoury bites, desserts, crackers, accompaniments and seasonal produce. We curate each menu to suit your event, guest count and preferences.",
  },
  {
    q: "What's the minimum guest count?",
    a: "Our grazing tables are ideal for gatherings of 15 guests or more. For menus featuring predominantly finger foods, we can comfortably cater to up to 100 guests. If you'd like to include substantial mains, we can accommodate up to 30 guests.",
  },
  {
    q: "Do you provide serveware and plates?",
    a: "Yes. We take care of the complete setup, including serving platters, bowls, styling elements, and disposable plates, cutlery and napkins, so your guests can simply help themselves and enjoy.",
  },
  {
    q: "Can the menu be customised?",
    a: "Absolutely. Every grazing table is designed around your event. We customise the menu based on your preferences, guest profile, dietary requirements, occasion and budget, ensuring every table feels unique.",
  },
  {
    q: "Do you travel across Bangalore?",
    a: "Yes, we do. We cater across Bangalore. Depending on the venue, event timings and logistics, transportation and convenience charges may apply. Since we also return to dismantle the setup and collect our serveware, these charges are quoted based on your event location and schedule.",
  },
  {
    q: "How much notice do you need?",
    a: "We recommend booking at least two weeks in advance to ensure availability and allow us to plan every detail. Last-minute enquiries (2–3 days) may be accommodated, subject to our schedule and existing commitments.",
  },
  {
    q: "Do you stay and serve the guests?",
    a: "Grazing tables are designed as a self-serve experience, allowing guests to explore and enjoy the spread at their own pace. For larger events that include refills, our team remains on-site to replenish the table as needed. For smaller gatherings, we set up the table, ensure everything is ready, and return later to collect our serveware. We simply request that the plates and serving pieces are kept aside after use for easy collection.",
  },
  {
    q: "Can you accommodate Jain or vegan menus?",
    a: "Yes. We offer fully customised Jain-friendly menus and can also create a selection of vegan dishes. Simply let us know your dietary preferences when you enquire.",
  },
];

function GrazingPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data: galleryData } = usePublicGallery("grazing");
  const gallery = galleryData?.data ?? [];
  const [activeImg, setActiveImg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    event: "Birthday Party",
    date: "",
    time: "",
    location: "",
    guests: "20–30",
    budget: "₹15,000 – ₹25,000",
    diet: "No restriction",
    theme: "",
    notes: "",
  });
  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Hi Mezcla! I'd like to plan a Grazing Table.\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\n` +
      `Event: ${form.event}\nDate: ${form.date}\nTime: ${form.time}\n` +
      `Venue / Area in Bangalore: ${form.location}\n` +
      `Guest Count: ${form.guests}\nBudget: ${form.budget}\n` +
      `Dietary Requirements: ${form.diet}\n` +
      `Theme / Palette: ${form.theme}\n\n` +
      `Additional Notes: ${form.notes}`;
    window.open(generateWhatsAppLink(msg), "_blank");
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-espresso overflow-hidden min-h-[90vh] flex items-center border-b border-white/5">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          <div className="hidden lg:block bg-gradient-to-r from-espresso via-espresso/95 to-transparent z-10" />
          <div className="absolute inset-0 bg-espresso/80 lg:hidden z-10" />
          <div className="absolute inset-0 lg:left-[40%]">
            <img
              src="/product_photos/dips-platter/dips1.jpg"
              alt="Luxury Grazing Table"
              className="size-full object-cover opacity-50 lg:opacity-90"
            />
            <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-espresso to-transparent" />
          </div>
        </div>

        <div className="container-luxe relative z-20 w-full pt-40 pb-24 lg:py-0">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20 backdrop-blur-md">
              <Sparkles className="size-3" />
              Grazing Tables · Bangalore
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] tracking-tight">
              Where great food becomes the{" "}
              <span className="italic text-gold font-light">centrepiece of every celebration.</span>
            </h1>
            <p className="mt-8 text-ivory-muted/90 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              From intimate brunches and birthdays to weddings, baby showers and corporate gatherings, our grazing tables are designed to bring people together over beautifully presented, handcrafted food.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#plan" className="px-8 py-4 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                Plan Your Grazing Table
              </a>
              {gallery.length > 0 && (
                <a href="#gallery" className="px-8 py-4 border border-white/20 text-cream hover:border-gold hover:text-gold font-bold uppercase tracking-widest text-xs rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                  View Gallery
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="bg-cocoa border-b border-white/5">
        <div className="container-luxe py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:p-8 md:p-10 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { icon: <Users className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "15 – 100", label: "Guest Capacity" },
              { icon: <Clock className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "45–60 min", label: "On-site Setup Time" },
              { icon: <MapPin className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Bangalore", label: "Service Area" },
              { icon: <Diamond className="size-5 text-gold mb-4 opacity-80" strokeWidth={1.5} />, val: "Bespoke", label: "Custom Menus" },
            ].map((m, i) => (
              <div key={i} className={`flex flex-col items-center justify-center text-center px-4 ${i > 1 ? "pt-10 md:pt-0" : "pt-4 md:pt-0"}`}>
                {m.icon}
                <p className="font-display text-2xl text-cream mb-1">{m.val}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-ivory-muted/60 font-semibold">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── More than a table ── */}
      <section className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="eyebrow !text-gold-deep">More than a table of food.</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl text-ink leading-tight">
              Food the way it's meant to be <span className="italic text-gold-deep">shared.</span>
            </h2>
            <div className="mt-8 space-y-5 text-ink/70 text-base md:text-lg leading-relaxed">
              <p>
                A grazing table invites people to slow down, gather around and enjoy food the way it's meant to be shared.
              </p>
              <p>
                At Mezcla, every table is individually designed to suit your celebration. We combine artisan breads, handcrafted dips, premium cheeses, fresh fruits, desserts and savoury bites into a spread that's as inviting to look at as it is to eat.
              </p>
              <p className="font-medium text-ink">
                No two celebrations are the same—and neither are our grazing tables.
              </p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gold/10">
            <img
              src="/product_photos/dips-platter/dips1.jpg"
              alt="Mezcla Grazing Table"
              className="w-full h-[480px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Why people love ── */}
      <section className="bg-espresso text-cream py-24 md:py-32 border-y border-white/5">
        <div className="container-luxe max-w-4xl text-center">
          <p className="eyebrow !text-gold">Why people love grazing tables</p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
            Where the best moments <span className="italic text-gold font-light">unfold.</span>
          </h2>
          <div className="mt-10 text-ivory-muted/90 text-lg leading-relaxed space-y-4 max-w-2xl mx-auto">
            <p>There is something special about a table that invites people to pause, pick, share and linger.</p>
            <p>Conversations begin over cheese and crackers. Children reach for their favourite treats. Friends gather around for "just one more bite."</p>
            <p className="text-cream font-medium">A grazing table isn't simply a way to serve food—it's often where the best moments of the celebration unfold.</p>
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeader
            eyebrow="Designed for every occasion"
            title="Whether you're hosting ten guests or a hundred."
            subtitle="We'll help create a spread that's perfect for your celebration."
            align="center"
          />
          <div className="mt-14 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {occasions.map((o) => (
              <span
                key={o}
                className="px-5 py-2.5 rounded-full bg-white border border-gold/20 text-sm font-medium text-ink shadow-soft hover:border-gold hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry Form ── */}
      <section id="plan" className="bg-espresso py-24 md:py-32">
        <div className="container-luxe max-w-4xl">
          <div className="text-center mb-16">
            <p className="eyebrow !text-gold mb-4">Let's create something your guests will remember.</p>
            <h2 className="font-display text-4xl md:text-6xl text-cream">Plan your grazing table.</h2>
            <p className="mt-4 text-ivory-muted/70 max-w-xl mx-auto leading-relaxed">
              Whether you're planning an intimate celebration or a large gathering, we'd love to bring your table to life.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-cocoa/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <Field label="Your Name">
                <input type="text" maxLength={80} value={form.name} onChange={(e) => update("name", e.target.value)} className="luxe-input" placeholder="Full name" required />
              </Field>
              <Field label="Phone / WhatsApp Number">
                <input type="tel" maxLength={15} value={form.phone} onChange={(e) => update("phone", e.target.value)} className="luxe-input" placeholder="+91 98765 43210" />
              </Field>
              <Field label="Event Type">
                <select value={form.event} onChange={(e) => update("event", e.target.value)} className="luxe-input">
                  {["Birthday Party", "Baby Shower", "Bridal Shower", "Anniversary", "House Party", "Corporate Event", "Team Celebration", "Festive Gathering", "Brunch", "Kitty Party", "Other"].map((o) => (
                    <option key={o} className="bg-cocoa">{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Event Date">
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="luxe-input" required />
              </Field>
              <Field label="Approximate Time">
                <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className="luxe-input" />
              </Field>
              <Field label="Venue / Area in Bangalore">
                <input type="text" maxLength={120} value={form.location} onChange={(e) => update("location", e.target.value)} className="luxe-input" placeholder="e.g. Indiranagar, Koramangala" />
              </Field>
              <Field label="Guest Count">
                <select value={form.guests} onChange={(e) => update("guests", e.target.value)} className="luxe-input">
                  {["15–20", "20–30", "30–50", "50–80", "80–100", "100+"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Approximate Budget">
                <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="luxe-input">
                  {["₹10,000 – ₹15,000", "₹15,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000+", "Not sure yet"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Dietary Requirements">
                <select value={form.diet} onChange={(e) => update("diet", e.target.value)} className="luxe-input">
                  {["No restriction", "Vegetarian", "Eggless", "Jain-friendly", "Vegan", "Mixed"].map((o) => <option key={o} className="bg-cocoa">{o}</option>)}
                </select>
              </Field>
              <Field label="Theme / Colour Palette">
                <input type="text" maxLength={120} value={form.theme} onChange={(e) => update("theme", e.target.value)} className="luxe-input" placeholder="e.g. Ivory & Gold, Boho, Minimal" />
              </Field>
              <Field label="Anything else you'd like us to know" full>
                <textarea rows={4} maxLength={800} value={form.notes} onChange={(e) => update("notes", e.target.value)} className="luxe-input" placeholder="Special requests, style references, dietary details..." />
              </Field>

              <div className="md:col-span-2 pt-2">
                <label className="flex items-start gap-4 text-sm text-ivory-muted/70 cursor-pointer group">
                  <input type="checkbox" required className="mt-1 accent-gold size-4 rounded-sm border-white/20 bg-espresso" />
                  <span className="group-hover:text-cream transition-colors">
                    I understand that grazing table bookings are confirmed only after an advance payment.
                  </span>
                </label>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 pt-4">
                <button type="submit" className="w-full sm:w-auto px-10 py-5 bg-gold text-cocoa font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-cream transition-all duration-300 hover:-translate-y-1">
                  Enquire Now via WhatsApp
                </button>
                <p className="text-xs text-ivory-muted/50 uppercase tracking-widest">We respond within 24 hours.</p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── Curation ── */}
      <section className="bg-cocoa py-24 md:py-32 border-y border-white/5">
        <div className="container-luxe grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow !text-gold">Every table is uniquely curated</p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl text-cream leading-tight">
              Depending on your preferences <br />
              <span className="italic text-gold font-light">and guest count.</span>
            </h2>
            <p className="mt-6 text-ivory-muted/80 leading-relaxed">Your grazing table may include:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {curationItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 rounded-2xl bg-espresso border border-white/5 hover:border-gold/30 transition-colors"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-ivory-muted/90 text-sm font-medium">{item.label}</span>
              </div>
            ))}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-espresso border border-gold/20 text-center">
              <p className="text-gold/80 text-sm italic">…and a few little surprises that make every Mezcla table unique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe">
          <SectionHeader eyebrow="How it works" title="A simple, considered journey." align="center" />
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {howItWorks.map((s, i) => (
              <div key={s.title} className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white border border-border hover:border-gold/30 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-9xl font-display text-ink/[0.03] group-hover:text-gold/[0.08] transition-colors leading-none select-none">
                  {i + 1}
                </div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-ink/5 border border-ink/10 text-xs font-bold uppercase tracking-widest text-gold-deep mb-6">Step 0{i + 1}</span>
                  <p className="font-display text-xl lg:text-2xl text-ink leading-snug mb-3">{s.title}</p>
                  <p className="text-ink/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Different ── */}
      <section className="bg-espresso py-24 md:py-32 border-y border-white/5">
        <div className="container-luxe">
          <SectionHeader eyebrow="Why our grazing tables are different" title="Quality in every detail." align="center" dark />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {whyDifferent.map((w) => (
              <div key={w.title} className="rounded-3xl bg-cocoa border border-white/5 p-8 md:p-10 hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 group">
                <div className="size-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
                  <Sparkles className="size-4 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-cream group-hover:text-gold transition-colors mb-3">{w.title}</h3>
                <p className="text-ivory-muted/70 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section id="gallery" className="bg-cocoa py-24 md:py-32 border-y border-white/5">
          <div className="container-luxe">
            <SectionHeader eyebrow="Gallery" title="Past setups and grazing tables." align="center" dark />
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-12">
              {gallery.map((img: any, i: number) => (
                <button key={i} onClick={() => setActiveImg(img.url)} className="block w-full break-inside-avoid overflow-hidden rounded-2xl shadow-lg border border-white/5 hover:border-gold/30 transition-all duration-500 group">
                  <img src={img.url} alt={img.caption || "Grazing Table"} loading="lazy" className="w-full group-hover:scale-105 transition-transform duration-700" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      <FAQSection 
        customFaqs={faqs} 
        title={<>Frequently <br /><span className="italic text-gold-deep">asked.</span></>}
      />

      <style>{`
        .luxe-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--color-cream);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .luxe-input::placeholder { color: rgba(255, 255, 255, 0.2); }
        .luxe-input:focus {
          outline: none;
          border-color: var(--color-gold);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 1px var(--color-gold);
        }
      `}</style>

      {activeImg && (
        <div className="fixed inset-0 z-[60] bg-espresso/95 backdrop-blur-sm grid place-items-center p-6" onClick={() => setActiveImg(null)}>
          <button className="absolute top-6 right-6 text-cream/50 hover:text-gold p-2 transition-colors"><X className="size-8" /></button>
          <img src={activeImg} alt="Preview" className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl ring-1 ring-white/10" />
        </div>
      )}
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
