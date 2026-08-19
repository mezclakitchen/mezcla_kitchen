import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "@/components/ui-custom/PolicyShell";

export const Route = createFileRoute("/delivery")({
  head: () => ({ meta: [{ title: "Delivery Information | Mezcla" }, { name: "description", content: "Delivery areas, timelines and packaging for Mezcla orders." }] }),
  component: () => (
    <PolicyShell
      eyebrow="Logistics"
      title="Delivery Information"
      intro="Carefully packed and delivered on time, wherever the celebration is."
      sections={[
        { h: "Local delivery", p: "We deliver across the city. Slots are confirmed once your order is placed." },
        { h: "Pan-India shipping", p: "Selected jars, snacks and shelf-stable hampers ship nationwide via insured couriers." },
        { h: "Event setup", p: "For grazing tables, our team travels to your venue and styles the spread on site." },
        { h: "Packaging", p: "Everything ships in protective, reusable packaging designed for travel." },
      ]}
    />
  ),
});
