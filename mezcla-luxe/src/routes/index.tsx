import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { CategoryCards } from "@/components/sections/CategoryCards";
import { FestiveOffers } from "@/components/sections/FestiveOffers";
import { PopularThisWeek } from "@/components/sections/PopularThisWeek";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { OurPhilosophy } from "@/components/sections/OurPhilosophy";
import { BakeScheduleWidget } from "@/components/sections/BakeScheduleWidget";
import { PlanOccasionBanner } from "@/components/sections/PlanOccasionBanner";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramPreview } from "@/components/sections/InstagramPreview";
import { SubscribeSection } from "@/components/sections/SubscribeSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { OrderCutoffBanner } from "@/components/ui/OrderCutoffBanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mezcla — Artisanal Cakes, Hampers & Grazing Tables" },
      { name: "description", content: "Handcrafted food experiences for birthdays, weddings, festive gifting and intimate celebrations. Made fresh, customisable, delivered with care." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      {/* <OrderCutoffBanner /> */}
      <CategoryCards />
      <FestiveOffers />
      {/* <PopularThisWeek /> */}
      <TrustStrip />
      <OurPhilosophy />
      {/* <BakeScheduleWidget /> */}
      <PlanOccasionBanner />
      <Testimonials />
      <InstagramPreview />
      <SubscribeSection />
      <FAQSection />
    </>
  );
}
