import { createFileRoute } from "@tanstack/react-router";
import { PolicyShell } from "@/components/ui-custom/PolicyShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy | Mezcla" }, { name: "description", content: "How Mezcla handles your information." }] }),
  component: () => (
    <PolicyShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Your privacy matters. This page explains what we collect, why, and how we keep it safe."
      sections={[
        { h: "Information we collect", p: "Name, contact number, email address, delivery address, and event-related information necessary to fulfil your order." },
        { h: "How we use it", p: "To process and fulfil orders, communicate regarding bookings and deliveries, provide customer support, and share updates or promotional information if you have opted to receive them." },
        { h: "What we never do", p: "We do not sell, rent, or share your personal information with third parties except where necessary for payment processing, delivery services, or where required by law." },
        { h: "Consent", p: "By using our website and services, you consent to the collection and use of information in accordance with this policy." },
      ]}
    />
  ),
});
