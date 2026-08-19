import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles } from "lucide-react";
import { waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function MobileBottomBar() {
  const { generateWhatsAppLink } = useWhatsApp();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-dark border-t hairline">
      <div className="grid grid-cols-4 text-cream">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 py-3 text-[0.62rem] uppercase tracking-widest"
        >
          <Home className="size-4" /> Home
        </Link>
        <Link
          to="/products"
          className="flex flex-col items-center gap-1 py-3 text-[0.62rem] uppercase tracking-widest"
        >
          <BookOpen className="size-4" /> Menu
        </Link>
        <Link
          to="/grazing-tables"
          className="flex flex-col items-center gap-1 py-3 text-[0.62rem] uppercase tracking-widest"
        >
          <Sparkles className="size-4" /> Experiences
        </Link>
        <a
          href={generateWhatsAppLink(waMessages.general)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-[0.62rem] uppercase tracking-widest bg-whatsapp text-white"
        >
          <WhatsAppIcon className="size-4" /> WhatsApp
        </a>
      </div>
    </nav>
  );
}
