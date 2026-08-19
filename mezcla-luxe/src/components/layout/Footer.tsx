import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Clock, ShieldCheck, Facebook, Linkedin } from "lucide-react";
import { site, waMessages } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { usePublicContactInfo } from "@/hooks/usePublicApi";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function Footer() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data: contactData } = usePublicContactInfo();
  const contact = contactData?.data || {};

  return (
    <footer className="bg-espresso text-ivory-muted relative overflow-hidden border-t border-white/5">
      {/* Massive decorative background text */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full overflow-hidden leading-none select-none pointer-events-none opacity-[0.03]">
        <h2 className="font-display text-[22vw] text-cream text-center whitespace-nowrap tracking-tighter">MEZCLA</h2>
      </div>

      <div className="container-luxe relative z-10 pt-32 pb-12">
        <div className="grid gap-16 lg:grid-cols-12 mb-24">
          
          {/* Brand & Contact Column */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block group">
              <img src="/logo-filled.png" alt="Mezcla Logo" className="h-20 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105 origin-left" />
            </Link>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-ivory-muted/90">
              Mezcla is an artisanal kitchen in Bangalore crafting handcrafted breads, desserts, grazing tables and curated food experiences. Every order is made fresh in small batches with thoughtfully sourced ingredients, bringing people together one memorable bite at a time.
            </p>
            
            <div className="mt-10 space-y-4 text-base text-ivory-muted/90">
              <a href={`mailto:${contact.email || site.email}`} className="flex items-center gap-3 hover:text-gold transition-colors w-fit group">
                <div className="p-2 rounded-full border border-white/10 group-hover:border-gold/30 group-hover:bg-gold/10 transition-colors">
                  <Mail className="size-3.5 text-gold" strokeWidth={1.5} />
                </div>
                {contact.email || site.email}
              </a>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full border border-white/10">
                  <MapPin className="size-3.5 text-gold" strokeWidth={1.5} />
                </div>
                {contact.address || site.address}
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full border border-white/10">
                  <Clock className="size-3.5 text-gold" strokeWidth={1.5} />
                </div>
                {contact.hours || site.hours}
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <a
                href={contact.instagram || site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-3 rounded-full bg-cocoa border border-white/10 hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <Instagram className="size-4" strokeWidth={1.5} />
              </a>
              {contact.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="p-3 rounded-full bg-cocoa border border-white/10 hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1"
                >
                  <Facebook className="size-4" strokeWidth={1.5} />
                </a>
              )}
              <a
                href={contact.linkedin || site.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-3 rounded-full bg-cocoa border border-white/10 hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <Linkedin className="size-4" strokeWidth={1.5} />
              </a>
              <a
                href={generateWhatsAppLink(waMessages.general)}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="p-3 rounded-full bg-cocoa border border-white/10 hover:border-gold hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:pl-12">
            <FooterCol
              title="Menu"
              items={[
                ["/sourdough-breads", "Sourdough Bread"],
                ["/specialty-breads", "Speciality Bread"],
                ["/other-bakes", "Other Bakes & Desserts"],
                ["/dips", "Dips & Mezze"],
                ["/cakes", "Cakes"],
                ["/products", "Full Menu"],
              ]}
            />
            <FooterCol
              title="Experiences"
              items={[
                ["/grazing-tables", "Grazing Tables"],
                ["/snack-boxes", "Gourmet Snack Boxes"],
                ["/food-hampers", "Food Hampers"],
                ["/workshops", "Workshops"],
                ["/catering", "Corporate Catering"],
                ["/plan-event", "Plan Your Event"],
              ]}
            />
            <FooterCol
              title="Studio"
              items={[
                ["/about", "Our Story"],
                ["/gallery", "Gallery"],
                ["/blog", "Journal"],
                ["/contact", "Contact"],
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-xs uppercase tracking-widest font-semibold text-ivory-muted/60">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" strokeWidth={1.5} /> {contact.fssai || site.fssai}
            </span>
            <span className="hidden md:inline-block text-white/20">|</span>
            <span>© {new Date().getFullYear()} Mezcla · The Artisanal Kitchen</span>
          </div>
          
          <div className="flex gap-6 text-xs uppercase tracking-widest font-semibold text-ivory-muted/60">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <Link to="/refund" className="hover:text-gold transition-colors">Refunds</Link>
            <Link to="/delivery" className="hover:text-gold transition-colors">Delivery</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6">{title}</h4>
      <ul className="space-y-4 text-base text-ivory-muted/90">
        {items.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="hover:text-gold transition-colors block w-fit">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
