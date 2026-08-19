import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, UtensilsCrossed, Layers } from "lucide-react";
import { generateWhatsAppLink, waMessages } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

const menuItems = [
  { to: "/sourdough-breads", label: "Sourdough Bread", desc: "Long-fermented loaves — available every Wednesday, order by Monday" },
  { to: "/specialty-breads", label: "Speciality Bread", desc: "Milk bread, focaccia, pita, kulcha, baguette & more" },
  { to: "/other-bakes", label: "Other Bakes & Desserts", desc: "K-buns, Berliners, quiches, rolls, brownies & jar cakes" },
  { to: "/dips", label: "Handcrafted Dips & Mezze", desc: "Hummus, muhammara, pesto, tzatziki, labneh & more" },
  { to: "/cakes", label: "Cakes", desc: "Handcrafted eggless celebration cakes, made to order" },
];

const experienceItems = [
  { to: "/grazing-tables", label: "Grazing Tables", desc: "Spectacular spreads for events & celebrations" },
  { to: "/snack-boxes", label: "Gourmet Snack Boxes", desc: "Curated boxes for offices, parties & gifting" },
  { to: "/food-hampers", label: "Food Hampers", desc: "Artisanal hampers, thoughtfully curated" },
  { to: "/workshops", label: "Workshops", desc: "Hands-on baking & food experiences" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState<null | "menu" | "experiences">(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (expRef.current && !expRef.current.contains(e.target as Node)) setExpOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-cocoa/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-luxe flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setOpen(false)}>
          <img src="/logo-filled.png" alt="Mezcla Logo" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-black/20 backdrop-blur-md">
          {/* Home */}
          <Link
            to="/"
            className="px-4 py-2 rounded-full text-[0.85rem] font-medium tracking-wide text-ivory-muted hover:text-cream hover:bg-white/10 transition-all"
            activeProps={{ className: "!text-gold bg-gold/10 hover:!bg-gold/15" }}
          >
            Home
          </Link>

          {/* Menu Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => { setMenuOpen(!menuOpen); setExpOpen(false); }}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.85rem] font-medium tracking-wide transition-all ${
                menuOpen ? "text-gold bg-gold/10" : "text-ivory-muted hover:text-cream hover:bg-white/10"
              }`}
            >
              <UtensilsCrossed className="size-3.5" strokeWidth={1.8} />
              Menu
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-cocoa/98 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
                <div className="p-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-white/8 transition-colors group"
                    >
                      <span className="text-sm font-medium text-cream group-hover:text-gold transition-colors">{item.label}</span>
                      <span className="text-xs text-ivory-muted/70">{item.desc}</span>
                    </Link>
                  ))}
                  <div className="mt-1 mx-2 pt-2 border-t border-white/10">
                    <Link
                      to="/products"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors text-center"
                    >
                      View Full Menu →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Experiences Dropdown */}
          <div ref={expRef} className="relative">
            <button
              onClick={() => { setExpOpen(!expOpen); setMenuOpen(false); }}
              aria-expanded={expOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.85rem] font-medium tracking-wide transition-all ${
                expOpen ? "text-gold bg-gold/10" : "text-ivory-muted hover:text-cream hover:bg-white/10"
              }`}
            >
              <Layers className="size-3.5" strokeWidth={1.8} />
              Experiences
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${expOpen ? "rotate-180" : ""}`} />
            </button>
            {expOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-cocoa/98 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
                <div className="p-2">
                  {experienceItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setExpOpen(false)}
                      className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-white/8 transition-colors group"
                    >
                      <span className="text-sm font-medium text-cream group-hover:text-gold transition-colors">{item.label}</span>
                      <span className="text-xs text-ivory-muted/70">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simple links */}
          {[
            { to: "/gallery", label: "Gallery" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 rounded-full text-[0.85rem] font-medium tracking-wide text-ivory-muted hover:text-cream hover:bg-white/10 transition-all"
              activeProps={{ className: "!text-gold bg-gold/10 hover:!bg-gold/15" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href={generateWhatsAppLink(waMessages.menu)}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex btn-gold !py-2.5 !px-5 !text-sm font-semibold shadow-lg shadow-gold/20"
          >
            <WhatsAppIcon className="size-3.5" />
            Order Now
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-cream"
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden glass-dark border-t hairline max-h-[80vh] overflow-y-auto">
          <nav className="container-luxe flex flex-col py-4 gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="py-3 text-cream/90 border-b hairline text-sm">Home</Link>

            {/* Menu accordion */}
            <div>
              <button
                onClick={() => setMobileMenu(mobileMenu === "menu" ? null : "menu")}
                className="w-full flex items-center justify-between py-3 text-cream/90 border-b hairline text-sm"
              >
                <span className="flex items-center gap-2"><UtensilsCrossed className="size-4" /> Menu</span>
                <ChevronDown className={`size-4 transition-transform ${mobileMenu === "menu" ? "rotate-180" : ""}`} />
              </button>
              {mobileMenu === "menu" && (
                <div className="pl-4 py-1 flex flex-col gap-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="py-2.5 text-ivory-muted/80 text-sm border-b border-white/5 hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link to="/products" onClick={() => setOpen(false)} className="py-2.5 text-gold text-sm font-medium">
                    View Full Menu →
                  </Link>
                </div>
              )}
            </div>

            {/* Experiences accordion */}
            <div>
              <button
                onClick={() => setMobileMenu(mobileMenu === "experiences" ? null : "experiences")}
                className="w-full flex items-center justify-between py-3 text-cream/90 border-b hairline text-sm"
              >
                <span className="flex items-center gap-2"><Layers className="size-4" /> Experiences</span>
                <ChevronDown className={`size-4 transition-transform ${mobileMenu === "experiences" ? "rotate-180" : ""}`} />
              </button>
              {mobileMenu === "experiences" && (
                <div className="pl-4 py-1 flex flex-col gap-1">
                  {experienceItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="py-2.5 text-ivory-muted/80 text-sm border-b border-white/5 hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { to: "/gallery", label: "Gallery" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-cream/90 border-b hairline text-sm">
                {n.label}
              </Link>
            ))}

            <a
              href={generateWhatsAppLink(waMessages.menu)}
              target="_blank"
              rel="noreferrer"
              className="btn-gold mt-4"
            >
              <WhatsAppIcon className="size-4" />
              Order on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
