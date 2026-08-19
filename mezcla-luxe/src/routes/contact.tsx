import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock, Instagram, ShieldCheck, Phone, Linkedin, MessageCircle, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { waMessages, site as fallbackSite } from "@/lib/site";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { usePublicContactInfo } from "@/hooks/usePublicApi";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mezcla — Bangalore Kitchen | WhatsApp, Email & Studio" },
      {
        name: "description",
        content:
          "WhatsApp is the fastest way to reach us for custom cakes, hampers, snack boxes and grazing tables in Bangalore.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { generateWhatsAppLink } = useWhatsApp();
  const { data } = usePublicContactInfo();
  const contact = data?.data ?? {};
  
  const whatsapp = contact.whatsapp || contact.phone || fallbackSite.phone;
  const phone = contact.phone || fallbackSite.phone;
  const email = contact.email || fallbackSite.email;
  const address = contact.address || fallbackSite.address;
  const hours = contact.hours || fallbackSite.hours;
  const instagram = contact.instagram || fallbackSite.instagram;
  const fssai = contact.fssai || fallbackSite.fssai;

  return (
    <>
      {/* Immersive Hero Header */}
      <section className="bg-espresso pt-40 pb-32 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="container-luxe max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 text-gold text-[0.65rem] font-bold uppercase tracking-widest rounded-full mb-8 border border-gold/20 backdrop-blur-md">
            <MessageCircle className="size-3" />
            Concierge
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] tracking-tight">
            Let's plan something <br />
            <span className="italic text-gold font-light">honest.</span>
          </h1>
          <p className="mt-8 text-ivory-muted/90 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light">
            WhatsApp is the fastest way to reach our kitchen. We typically reply within a few
            hours during business hours.
          </p>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <section className="bg-cream text-ink py-24 md:py-32">
        <div className="container-luxe grid lg:grid-cols-[1.5fr_1fr] gap-8">
          
          {/* Left Column: VIP WhatsApp & Quick Links */}
          <div className="space-y-8">
            
            {/* VIP WhatsApp Card */}
            <a
              href={generateWhatsAppLink(waMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="block bg-cocoa text-cream p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] relative overflow-hidden group border border-white/5 hover:border-gold/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <WhatsAppIcon className="size-64 -mb-10 -mr-10 text-white" />
              </div>
              <div className="relative z-10">
                <span className="grid place-items-center size-16 rounded-full bg-whatsapp text-white mb-8 shadow-[0_0_30px_rgba(37,211,102,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <WhatsAppIcon className="size-7" />
                </span>
                <p className="eyebrow !text-gold">The VIP Lane</p>
                <h3 className="mt-3 font-display text-4xl text-cream">Open a chat</h3>
                <p className="text-ivory-muted/70 mt-4 max-w-sm leading-relaxed">
                  Direct line to our kitchen. No automated bots, ever. We respond personally to every inquiry.
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <span className="px-6 py-3 rounded-full bg-gold-deep text-white font-bold uppercase tracking-widest text-[0.65rem] shadow-md group-hover:bg-cream group-hover:text-cocoa transition-colors duration-300">
                    Message +{whatsapp.replace(/(\d{2})(\d{5})(\d{5})/, "$1 $2 $3")}
                  </span>
                </div>
              </div>
            </a>

            {/* Quick Links Bento */}
            <div className="p-6 sm:p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] bg-white border border-border shadow-soft">
              <p className="eyebrow !text-gold-deep">Quick Inquiries</p>
              <h3 className="mt-3 font-display text-3xl text-ink">Tell us what you're planning</h3>
              <p className="mt-4 text-ink-muted text-sm leading-relaxed">
                These open a pre-filled WhatsApp message — just edit and send.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <QL label="See the menu" msg={waMessages.menu} />
                <QL label="Plan a grazing table" msg={waMessages.grazing()} />
                <QL label="Customise a hamper" msg={waMessages.hamper()} />
                <QL label="Corporate gifting (50+)" msg={waMessages.corporate()} />
                <QL label="Order snack boxes" msg={waMessages.snackBox()} />
                <QL label="Party / event food" msg={waMessages.party()} />
              </div>
            </div>
            
          </div>

          {/* Right Column: Directory & Map */}
          <div className="space-y-8 flex flex-col">
            
            {/* The Directory */}
            <div className="p-6 sm:p-8 md:p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white border border-border shadow-soft">
              <p className="eyebrow !text-gold-deep mb-8">The Directory</p>
              <div className="space-y-6 divide-y divide-ink/5">
                <DirectoryRow icon={<Phone />} label="Phone" value={`+${phone.replace(/(\d{2})(\d{5})(\d{5})/, "$1 $2 $3")}`} href={`tel:+${phone.replace(/\D/g, "")}`} />
                <DirectoryRow icon={<Mail />} label="Email" value={email} href={`mailto:${email}`} />
                <DirectoryRow icon={<Clock />} label="Hours" value={hours} />
                <DirectoryRow icon={<MapPin />} label="Studio" value={address} />
                <DirectoryRow icon={<ShieldCheck />} label="FSSAI" value={fssai} />
                <DirectoryRow icon={<Instagram />} label="Instagram" value={instagram.replace('https://instagram.com/', '@').replace('https://www.instagram.com/', '@').replace('/', '')} href={instagram} />
                <DirectoryRow icon={<Linkedin />} label="LinkedIn" value="Mezcla" href="https://www.linkedin.com/company/mezcla-the-artisanal-kitchen/" />
              </div>
            </div>

            {/* Map (Rounded, borderless style) */}
            <div className="flex-1 min-h-[300px] rounded-[2.5rem] overflow-hidden shadow-soft relative group">
              <div className="absolute inset-0 bg-gold/10 mix-blend-multiply pointer-events-none group-hover:opacity-0 transition-opacity duration-700 z-10" />
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.14174690995!2d77.5620533!3d12.898605599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15bcf8d5f19d%3A0x4eb9d2f5f95f4de0!2sMezcla%20-%20The%20Artisanal%20Kitchen%20(Delivery%20Only)!5e0!3m2!1sen!2sin!4v1783077578849!5m2!1sen!2sin" className="absolute inset-0 w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-700" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

function DirectoryRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-6 first:pt-0 group-hover:text-gold-deep transition-colors">
      <div className="flex items-center gap-4 text-ink-muted group-hover:text-gold-deep transition-colors">
        <span className="[&>svg]:size-4">{icon}</span>
        <span className="text-sm font-medium uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-ink font-medium sm:text-right">{value}</span>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block group">
      {inner}
    </a>
  ) : (
    <div className="group cursor-default">
      {inner}
    </div>
  );
}

function QL({ label, msg }: { label: string; msg: string }) {
  const { generateWhatsAppLink } = useWhatsApp();
  return (
    <a
      href={generateWhatsAppLink(msg)}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between px-6 py-4 rounded-2xl bg-ink/[0.02] border border-border text-sm text-ink hover:border-gold-deep/30 hover:bg-gold-deep hover:text-white transition-all duration-300 group"
    >
      <span className="font-semibold tracking-wide">{label}</span>
      <ArrowRight className="size-4 text-ink-muted group-hover:text-white transition-colors" />
    </a>
  );
}
