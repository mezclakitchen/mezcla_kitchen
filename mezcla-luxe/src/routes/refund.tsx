import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "@/components/ui-custom/PolicyShell";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund & Cancellation Policy | Mezcla" }, { name: "description", content: "Cancellation and refund terms for Mezcla orders." }] }),
  component: () => (
    <PolicyShell
      eyebrow="Legal"
      title="Refund & Cancellation"
      intro="Because everything is made fresh to order, our cancellation window is limited."
      sections={[
        { h: "Cancellation window", p: "Orders can be cancelled up to 48 hours before the delivery date for a full refund." },
        { h: "Custom orders", p: "Custom hampers, cakes and grazing tables are non-refundable once production begins." },
        { h: "Quality concerns", p: "If something isn't right, please reach out within 24 hours of delivery with photos and we'll make it right." },
      ]}
    />
  ),
});
