import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { usePublicTestimonials, usePublicGoogleReviews } from "@/hooks/usePublicApi";

const FALLBACK = [
  { name: "Priya Sharma", location: "Indiranagar, Bangalore", text: "Absolutely love Mezcla! The sourdough is out of this world — crispy crust, perfectly chewy inside. I order every week and they never disappoint." },
  { name: "Rahul Verma", location: "Koramangala, Bangalore", text: "We ordered a grazing table for our team offsite and it was a showstopper. Every single person asked where it was from. Professional, beautiful and absolutely delicious." },
  { name: "Meera Nair", location: "Sadashivanagar, Bangalore", text: "Mezcla has become my go-to for any celebration. From the rosemary focaccia to the gourmet hampers — every product is made with so much care." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const { data: dbData, isLoading: dbLoading } = usePublicTestimonials();
  const { data: googleData, isLoading: googleLoading } = usePublicGoogleReviews();

  const isLoading = dbLoading || googleLoading;

  const formattedGoogle = (googleData?.data?.reviews || []).map((r: any) => ({
    name: r.authorAttribution?.displayName || "Google Reviewer",
    location: r.relativePublishTimeDescription || "Google Review",
    text: r.text?.text || r.text,
    rating: r.rating || 5
  }));

  const formattedDb = (dbData?.data || []).map((r: any) => ({
    name: r.name,
    location: r.location || "Customer",
    text: r.text,
    rating: r.rating || 5
  }));

  const combined = formattedDb.slice(0, 5);
  const all: any[] = combined.length ? combined : FALLBACK;
  
  const t = all[i] ?? all[0];
  const total = all.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setI((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  if (isLoading) {
    return (
      <section className="bg-espresso py-24 md:py-32">
        <div className="container-luxe text-center">
          <div className="h-8 w-48 bg-white/10 rounded mx-auto mb-8 animate-pulse" />
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-6 bg-white/10 rounded animate-pulse" />
            <div className="h-6 bg-white/10 rounded animate-pulse w-5/6 mx-auto" />
            <div className="h-6 bg-white/10 rounded animate-pulse w-4/6 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-espresso py-24 md:py-32">
      <div className="container-luxe">
        <SectionHeader eyebrow="Kind Words" title="What Our Customers Say" dark align="center" />
        <div className="max-w-4xl mx-auto text-center px-4">
          <Quote className="size-10 text-gold mx-auto" />
          
          <div className="flex justify-center gap-1 text-gold mt-6 mb-2">
            {[...Array(t.rating || 5)].map((_, n) => (
              <Star key={n} className="size-5 fill-current" />
            ))}
          </div>

          <div className="min-h-[12rem] flex items-center justify-center">
            <p className="mt-6 font-display text-xl md:text-3xl leading-relaxed md:leading-snug text-cream italic">
              "{t.text}"
            </p>
          </div>
          <div className="mt-8">
            <p className="text-cream">{t.name}</p>
            <p className="eyebrow !text-ivory-muted mt-1">{t.location}</p>
          </div>
          {total > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button onClick={() => setI((i - 1 + total) % total)}
                className="p-3 rounded-full border hairline text-cream hover:text-gold hover:border-gold transition-colors">
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex gap-2">
                {all.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setI(idx)}
                    className={`h-1 transition-all ${idx === i ? "w-8 bg-gold" : "w-4 bg-ivory-muted/30"}`} />
                ))}
              </div>
              <button onClick={() => setI((i + 1) % total)}
                className="p-3 rounded-full border hairline text-cream hover:text-gold hover:border-gold transition-colors">
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

