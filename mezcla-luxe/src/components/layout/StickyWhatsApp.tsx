import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export function StickyWhatsApp() {
  const { generateWhatsAppLink } = useWhatsApp();
  return (
    <a
      href={generateWhatsAppLink(waMessages.general)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Mezcla on WhatsApp"
      className="hidden md:inline-flex fixed bottom-6 right-6 z-50 btn-wa pulse-wa"
    >
      <WhatsAppIcon className="size-5" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
