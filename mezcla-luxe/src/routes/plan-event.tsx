import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { generateWhatsAppLink } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQSection } from "@/components/sections/FAQSection";
import heroImg from "@/assets/hero-grazing.jpg";

export const Route = createFileRoute("/plan-event")({
  head: () => ({
    meta: [
      { title: "Plan Your Event — Birthdays, Parties & Gatherings in Bangalore | Mezcla" },
      {
        name: "description",
        content:
          "Share details of your birthday, house party, anniversary or corporate event. We'll respond with a curated proposal — usually within a few hours.",
      },
    ],
    links: [{ rel: "canonical", href: "/plan-event" }],
  }),
  component: PlanEventPage,
});

function PlanEventPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    event: "Birthday",
    date: "",
    guests: "20-30",
    area: "",
    type: "Grazing Table",
    budget: "₹15,000 – ₹25,000",
    contact: "Anytime",
    notes: "",
  });
  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `Hi Mezcla, event enquiry:\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nEvent: ${form.event}\nDate: ${form.date}\n` +
      `Guests: ${form.guests}\nArea (Bangalore): ${form.area}\nRequirement: ${form.type}\nBudget: ${form.budget}\n` +
      `Preferred contact: ${form.contact}\n\nNotes: ${form.notes}`;
    setDone(true);
    window.open(generateWhatsAppLink(msg), "_blank");
  };

  return (
    <>
      <section className="relative bg-cocoa overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 size-full object-cover opacity-30" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/60 to-cocoa" />
        <div className="container-luxe relative py-24 md:py-32 max-w-3xl">
          <p className="eyebrow">Plan with us</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl text-cream leading-[1.02]">
            Plan your <span className="italic text-gold">gathering</span>.
          </h1>
          <p className="mt-6 text-ivory-muted text-base md:text-lg max-w-xl leading-relaxed">
            Birthdays, house parties, anniversaries, baby showers, intimate weddings,
            small corporate gatherings. Tell us a little — we'll come back with ideas.
          </p>
        </div>
      </section>

      <section className="bg-cream text-ink py-20 md:py-24">
        <div className="container-luxe max-w-4xl">
          <form
            onSubmit={submit}
            className="grid md:grid-cols-2 gap-5 bg-white rounded-3xl p-7 md:p-6 sm:p-8 md:p-10 border border-border shadow-soft"
          >
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
            <F label="Your name">
              <input required maxLength={80} value={form.name} onChange={(e) => set("name", e.target.value)} className="luxe-input" />
            </F>
            <F label="Phone (WhatsApp)">
              <input required type="tel" maxLength={20} value={form.phone} onChange={(e) => set("phone", e.target.value)} className="luxe-input" />
            </F>
            <F label="Event type">
              <select value={form.event} onChange={(e) => set("event", e.target.value)} className="luxe-input">
                {[
                  "Birthday",
                  "House Party",
                  "Anniversary",
                  "Baby Shower",
                  "Engagement / Intimate Wedding",
                  "Corporate / Office",
                  "Other",
                ].map((o) => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="Event date">
              <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="luxe-input" />
            </F>
            <F label="Guest count">
              <select value={form.guests} onChange={(e) => set("guests", e.target.value)} className="luxe-input">
                {["10-15", "15-20", "20-30", "30-50", "50-80", "80-100"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="Area in Bangalore">
              <input maxLength={120} value={form.area} onChange={(e) => set("area", e.target.value)} className="luxe-input" placeholder="e.g. HSR, Indiranagar" />
            </F>
            <F label="Requirement">
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="luxe-input">
                {["Grazing Table", "Snack Boxes", "Hampers", "Cake / Desserts", "Full Package"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="Budget">
              <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className="luxe-input">
                {["Under ₹10,000", "₹10,000 – ₹15,000", "₹15,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000+"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="Preferred contact time">
              <select value={form.contact} onChange={(e) => set("contact", e.target.value)} className="luxe-input">
                {["Morning", "Afternoon", "Evening", "Anytime"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="Notes" full>
              <textarea rows={4} maxLength={800} value={form.notes} onChange={(e) => set("notes", e.target.value)} className="luxe-input" />
            </F>
            <div className="md:col-span-2">
              <label className="flex items-start gap-3 text-xs text-ink-muted">
                <input type="checkbox" required className="mt-1" />
                <span>
                  I agree to be contacted about my enquiry and have read the{" "}
                  <a href="/privacy" className="underline">Privacy Policy</a>.
                </span>
              </label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-gold">Send Enquiry on WhatsApp</button>
              {done && <p className="mt-3 text-sm text-gold-deep">Thank you — we've opened WhatsApp with your details.</p>}
            </div>
          </form>
        </div>
        <style>{`.luxe-input{width:100%;padding:.85rem 1rem;border-radius:.85rem;background:var(--color-cream);border:1px solid var(--color-border);color:var(--color-ink);font-size:.9rem}.luxe-input:focus{outline:none;border-color:var(--color-gold)}`}</style>
      </section>

      <Testimonials />
      <FAQSection />
    </>
  );
}

function F({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`${full ? "md:col-span-2" : ""} block`}>
      <span className="eyebrow !text-ink-muted block mb-2">{label}</span>
      {children}
    </label>
  );
}
