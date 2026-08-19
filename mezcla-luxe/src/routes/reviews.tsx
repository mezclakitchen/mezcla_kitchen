import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { usePublicTestimonials, usePublicGoogleReviews } from "@/hooks/usePublicApi";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — What Customers Say | Mezcla" },
      { name: "description", content: "Read genuine reviews from Mezcla customers about our cakes, hampers, grazing tables and events." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data: localData } = usePublicTestimonials();
  const { data: googleData } = usePublicGoogleReviews();

  const dbTestimonials = localData?.data || [];
  const googleReviews = googleData?.data?.reviews || [];
  const googleRating = googleData?.data?.rating;
  const userRatingCount = googleData?.data?.userRatingCount;

  return (
    <>
      <section className="bg-cocoa py-20 border-b hairline">
        <div className="container-luxe max-w-3xl">
          <p className="eyebrow">In Their Words</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-cream">Reviews</h1>
          <p className="mt-4 text-ivory-muted">Honest stories from celebrations we've been part of.</p>
        </div>
      </section>

      <section className="bg-cream text-ink py-24">
        <div className="container-luxe">
          <SectionHeader 
            eyebrow="Customers" 
            title={googleRating ? `Loved across Bangalore. Rated ${googleRating}/5 on Google.` : "Loved across the country."} 
            align="center" 
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show Google Reviews first if they exist */}
            {googleReviews.map((t: any, i: number) => (
              <article key={`g-${i}`} className="rounded-2xl bg-white border border-border p-8 shadow-soft">
                <div className="flex gap-0.5 text-gold">{[...Array(t.rating || 5)].map((_, n) => <Star key={n} className="size-4 fill-current" />)}</div>
                <p className="mt-5 text-ink leading-relaxed">"{t.text?.text || t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  {t.authorAttribution?.photoUri && (
                    <img src={t.authorAttribution.photoUri} alt={t.authorAttribution.displayName} className="w-10 h-10 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{t.authorAttribution?.displayName || "Google Reviewer"}</p>
                    <p className="text-xs text-ink-muted">{t.relativePublishTimeDescription}</p>
                  </div>
                </div>
              </article>
            ))}

            {/* Then show DB Testimonials */}
            {dbTestimonials.map((t: any, i: number) => (
              <article key={`db-${i}`} className="rounded-2xl bg-white border border-border p-8 shadow-soft">
                <div className="flex gap-0.5 text-gold">{[...Array(5)].map((_, n) => <Star key={n} className="size-4 fill-current" />)}</div>
                <p className="mt-5 text-ink leading-relaxed">"{t.content}"</p>
                <div className="mt-6">
                  <p className="font-medium">{t.customer_name}</p>
                  <p className="text-xs text-ink-muted">{t.event_type ? `${t.event_type}` : 'Customer'}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-ink-muted">
            {googleRating ? `Based on ${userRatingCount} reviews from Google.` : "Powered by Mezcla customers."}
          </p>
        </div>
      </section>
    </>
  );
}
