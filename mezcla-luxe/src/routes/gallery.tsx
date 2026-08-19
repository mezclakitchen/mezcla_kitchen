import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { usePublicGallery } from "@/hooks/usePublicApi";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Cakes, Hampers & Grazing Tables | Mezcla" },
      { name: "description", content: "Browse our gallery of artisan cakes, luxury hampers, grazing tables and event setups crafted by Mezcla." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [active, setActive] = useState<string | null>(null);
  const { data, isLoading } = usePublicGallery();
  const { generateWhatsAppLink } = useWhatsApp();
  const imgs: any[] = data?.data ?? [];

  return (
    <>
      <section className="bg-cocoa py-20 border-b hairline">
        <div className="container-luxe max-w-3xl">
          <p className="eyebrow">Looking Back</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-cream">Gallery</h1>
          <p className="mt-4 text-ivory-muted">A glimpse of recent celebrations, hampers and tables.</p>
        </div>
      </section>

      <section className="bg-cream text-ink py-16">
        <div className="container-luxe">
          {isLoading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-full h-48 bg-gray-200 animate-pulse rounded-2xl break-inside-avoid" />
              ))}
            </div>
          ) : imgs.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setActive(img.url)} className="block w-full break-inside-avoid overflow-hidden rounded-2xl">
                  <img src={img.url} alt={img.caption || "Gallery"} loading="lazy" className="w-full hover:scale-105 transition-transform duration-700" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-muted py-12">No images in the gallery yet.</p>
          )}
        </div>
        <div className="container-luxe text-center mt-16">
          <p className="text-ink-muted">Loved something here? <a href={generateWhatsAppLink("Hi Mezcla, I loved a picture in your gallery and wanted to ask if you could recreate it!")} className="underline text-gold-deep" target="_blank" rel="noreferrer">Send us a screenshot on WhatsApp</a> and we'll recreate it.</p>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60] bg-cocoa/90 backdrop-blur grid place-items-center p-6" onClick={() => setActive(null)}>
          <button className="absolute top-6 right-6 text-cream p-2"><X /></button>
          <img src={active} alt="Preview" className="max-h-[88vh] max-w-full rounded-2xl shadow-luxe" />
        </div>
      )}
    </>
  );
}

