import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import cake from "@/assets/p-cake.jpg";
import truffles from "@/assets/p-truffles.jpg";
import hampers from "@/assets/cat-hampers.jpg";
import grazing from "@/assets/cat-grazing-tables.jpg";
import breads from "@/assets/cat-breads.jpg";
import dips from "@/assets/cat-dips.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Stories, Guides & Ideas | Mezcla" },
      { name: "description", content: "Guides on hampers, grazing tables, sourdough, festive gifting and planning intimate events in Bangalore." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const posts = [
  { t: "How to choose a hamper that actually feels personal", img: hampers, cat: "Gifting", read: "5 min" },
  { t: "Planning a grazing table for 30 guests at home", img: grazing, cat: "Events", read: "7 min" },
  { t: "Why we bake sourdough the slow way", img: breads, cat: "Bread", read: "6 min" },
  { t: "Wedding favours that aren't another box of mithai", img: hampers, cat: "Weddings", read: "6 min" },
  { t: "Corporate gifting that doesn't feel corporate", img: hampers, cat: "Corporate", read: "5 min" },
  { t: "Snack boxes for office gatherings — what works", img: dips, cat: "Snack Boxes", read: "4 min" },
  { t: "Festive gifting calendar — when to start ordering", img: truffles, cat: "Festive", read: "4 min" },
  { t: "Hummus, muhammara, labneh — a tiny mezze guide", img: dips, cat: "Mezze", read: "5 min" },
  { t: "How many days before to order a custom cake", img: cake, cat: "Cakes", read: "3 min" },
  { t: "Hosting an intimate birthday at home in Bangalore", img: grazing, cat: "Hosting", read: "6 min" },
];

function BlogPage() {
  return (
    <>
      <section className="bg-cocoa py-20 border-b hairline">
        <div className="container-luxe max-w-3xl">
          <p className="eyebrow">The Journal</p>
          <h1 className="mt-4 font-display text-4xl sm:text-4xl md:text-6xl text-cream">
            Stories from the kitchen.
          </h1>
          <p className="mt-4 text-ivory-muted max-w-xl">
            Quiet writing on bread, mezze, hampers, grazing tables and small celebrations.
          </p>
        </div>
      </section>

      <section className="bg-cream text-ink py-20 md:py-24">
        <div className="container-luxe">
          <SectionHeader eyebrow="Reading" title="Guides, ideas & inspiration." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article
                key={p.t}
                className="group rounded-2xl overflow-hidden bg-white border border-border shadow-soft hover:shadow-luxe transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.t}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow !text-gold-deep">{p.cat} · {p.read}</p>
                  <h3 className="mt-3 font-display text-lg leading-snug">{p.t}</h3>
                  <p className="mt-4 text-sm text-cocoa underline underline-offset-4">
                    Read article →
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-12 text-center text-xs text-ink-muted">
            Articles coming soon — drop us a note on WhatsApp to be first to read.
          </p>
        </div>
      </section>
    </>
  );
}
