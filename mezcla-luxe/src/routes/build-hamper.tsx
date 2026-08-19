import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { generateWhatsAppLink } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { Check } from "lucide-react";

export const Route = createFileRoute("/build-hamper")({
  head: () => ({
    meta: [
      { title: "Build Your Hamper — Bespoke Gifts | Mezcla" },
      { name: "description", content: "Design your own luxury hamper in minutes. Choose occasion, budget, items, packaging and personalisation — we'll craft and deliver." },
    ],
  }),
  component: BuildHamperPage,
});

const ITEMS = ["Truffles", "Brownies", "Granola Jar", "Cookies", "Cake Slice", "Dried Fruits", "Chocolate Bark", "Spiced Nuts", "Artisan Tea", "Preserves"];

function BuildHamperPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    occasion: "Festive", budget: "₹3,000 – ₹5,000", recipient: "Family",
    items: [] as string[], qty: "1", packaging: "Wooden box",
    note: "", date: "", area: "", name: "", phone: "",
  });
  const set = (k: string, v: unknown) => setData((s) => ({ ...s, [k]: v }));
  const toggleItem = (item: string) =>
    set("items", data.items.includes(item) ? data.items.filter((i) => i !== item) : [...data.items, item]);

  const summary = useMemo(() => {
    return `Hi Mezcla, I'd like to request a custom hamper:\n\n` +
      `Occasion: ${data.occasion}\nBudget: ${data.budget}\nRecipient: ${data.recipient}\n` +
      `Items: ${data.items.join(", ") || "Surprise me"}\nQuantity: ${data.qty}\nPackaging: ${data.packaging}\n` +
      `Personal note: ${data.note}\nDelivery date: ${data.date}\nArea: ${data.area}\n` +
      `Name: ${data.name}\nPhone: ${data.phone}`;
  }, [data]);

  return (
    <>
      <section className="bg-cocoa py-20 border-b hairline">
        <div className="container-luxe max-w-3xl text-center">
          <p className="eyebrow">Bespoke</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-cream">Build Your Hamper</h1>
          <p className="mt-4 text-ivory-muted">Five steps. Endless thoughtfulness. Sent to us on WhatsApp.</p>
        </div>
      </section>

      <section className="bg-cream text-ink py-16 md:py-24">
        <div className="container-luxe max-w-4xl">
          <div className="flex items-center justify-between mb-10">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex-1 flex items-center">
                <div className={`size-9 rounded-full grid place-items-center text-sm font-medium ${
                  step >= n ? "bg-cocoa text-cream" : "bg-almond text-ink-muted"
                }`}>{step > n ? <Check className="size-4" /> : n}</div>
                {n < 5 && <div className={`flex-1 h-px ${step > n ? "bg-cocoa" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white border border-border shadow-soft p-8 md:p-12">
            {step === 1 && (
              <Step title="Choose the occasion">
                <Grid items={["Festive","Wedding","Birthday","Anniversary","Corporate","Baby Shower","Thank You","Just Because"]}
                  value={data.occasion} onSelect={(v) => set("occasion", v)} />
              </Step>
            )}
            {step === 2 && (
              <Step title="Pick a budget">
                <Grid items={["₹1,500 – ₹3,000","₹3,000 – ₹5,000","₹5,000 – ₹8,000","₹8,000 – ₹15,000","₹15,000+"]}
                  value={data.budget} onSelect={(v) => set("budget", v)} />
              </Step>
            )}
            {step === 3 && (
              <Step title="Select preferred items">
                <div className="flex flex-wrap gap-2">
                  {ITEMS.map((i) => (
                    <button key={i} onClick={() => toggleItem(i)}
                      className={`px-4 py-2 rounded-full border text-sm ${data.items.includes(i) ? "bg-cocoa text-cream border-cocoa" : "border-border"}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </Step>
            )}
            {step === 4 && (
              <Step title="Packaging & personal touch">
                <div className="space-y-5">
                  <FieldRow label="Packaging">
                    <select value={data.packaging} onChange={(e) => set("packaging", e.target.value)} className="luxe-input">
                      {["Wooden box","Rigid gift box","Wicker basket","Cloth pouch","Custom"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </FieldRow>
                  <FieldRow label="Quantity">
                    <input type="number" min={1} value={data.qty} onChange={(e) => set("qty", e.target.value)} className="luxe-input" />
                  </FieldRow>
                  <FieldRow label="Personal note">
                    <textarea rows={3} value={data.note} onChange={(e) => set("note", e.target.value)} className="luxe-input" placeholder="Words to include in the hamper card" />
                  </FieldRow>
                </div>
              </Step>
            )}
            {step === 5 && (
              <Step title="Delivery & contact">
                <div className="grid md:grid-cols-2 gap-5">
                  <FieldRow label="Delivery date"><input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="luxe-input" /></FieldRow>
                  <FieldRow label="Delivery area"><input type="text" value={data.area} onChange={(e) => set("area", e.target.value)} className="luxe-input" placeholder="City / locality" /></FieldRow>
                  <FieldRow label="Your name"><input type="text" value={data.name} onChange={(e) => set("name", e.target.value)} className="luxe-input" /></FieldRow>
                  <FieldRow label="Phone"><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="luxe-input" /></FieldRow>
                </div>
              </Step>
            )}

            <div className="mt-10 flex flex-wrap justify-between gap-3">
              <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
                className="btn-dark disabled:opacity-30">Back</button>
              {step < 5
                ? <button onClick={() => setStep(step + 1)} className="btn-gold">Continue</button>
                : <a href={generateWhatsAppLink(summary)} target="_blank" rel="noreferrer" className="btn-gold">Send Hamper Request on WhatsApp</a>
              }
            </div>
          </div>
        </div>
        <style>{`.luxe-input{width:100%;padding:.85rem 1rem;border-radius:.85rem;background:var(--color-cream);border:1px solid var(--color-border);color:var(--color-ink);font-size:.9rem}.luxe-input:focus{outline:none;border-color:var(--color-gold)}`}</style>
      </section>
    </>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionHeader eyebrow="Step" title={title} />
      {children}
    </div>
  );
}
function Grid({ items, value, onSelect }: { items: string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((i) => (
        <button key={i} onClick={() => onSelect(i)}
          className={`p-5 rounded-2xl border text-left transition-all ${
            value === i ? "border-cocoa bg-cocoa text-cream" : "border-border hover:border-cocoa"
          }`}>{i}</button>
      ))}
    </div>
  );
}
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow !text-ink-muted block mb-2">{label}</span>
      {children}
    </label>
  );
}
