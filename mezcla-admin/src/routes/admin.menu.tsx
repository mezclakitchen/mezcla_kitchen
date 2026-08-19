import { createFileRoute } from "@tanstack/react-router";
import { useCategories, useProducts, useMenu } from "@/hooks/useApi";
import { Loader2, Printer } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";

export const Route = createFileRoute("/admin/menu")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "Menu Generator — Mezcla" }] }),
  component: MenuGeneratorPage,
});

const getSeasonalEdition = () => {
  const m = new Date().getMonth();
  const y = new Date().getFullYear();
  const seasons = ["The Winter Collection","The Winter Collection","The Spring Collection","The Spring Collection","The Spring Collection","The Monsoon Collection","The Monsoon Collection","The Monsoon Collection","The Festive Collection","The Festive Collection","The Festive Collection","The Winter Collection"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${seasons[m]} · ${months[m]} ${y}`;
};

function MenuGeneratorPage() {
  const { id } = Route.useSearch();
  const { data: menuData, isLoading: menuLoading } = useMenu(id || "");
  const { data: catData, isLoading: catLoading } = useCategories();
  const { data: prodData, isLoading: prodLoading } = useProducts();

  const menu = menuData?.data;
  const categories = catData?.data ?? [];
  const allProducts = prodData?.data ?? [];

  const productsToRender = useMemo(() => {
    if (id && menu?.items) {
      return menu.items.map((item: any) => ({
        ...item.products,
        price: item.custom_price !== null ? item.custom_price : item.products?.price,
        price_label: item.custom_price_label || item.products?.price_label,
        is_vegan: item.is_vegan || false,
        is_gf: item.is_gf || false,
        has_nuts: item.has_nuts || false,
      }));
    }
    return allProducts.filter((p: any) => p.is_available).map((p: any) => {
      const n = p.name.toLowerCase();
      return { ...p, is_vegan: n.includes('sourdough')||n.includes('hummus'), is_gf: n.includes('dip'), has_nuts: false };
    });
  }, [id, menu, allProducts]);

  const seasonalTag = getSeasonalEdition();

  const meta = useMemo(() => {
    const defaults = {
      tagline: seasonalTag,
      cover_text: "A curated selection of artisanal indulgence, slow-crafted with love and intention.",
      back_text: "For the ultimate Mezcla experience, pair our signature Olive & Rosemary Sourdough with the Roasted Red Pepper Dip.\n\nBest enjoyed with a crisp Sauvignon Blanc at golden hour.",
      quote: "Good food is the foundation of genuine happiness.",
      quote_author: "— Auguste Escoffier",
    };
    if (menu?.tagline?.startsWith("{")) {
      try {
        const d = JSON.parse(menu.tagline);
        return { ...defaults, ...Object.fromEntries(Object.entries(d).filter(([,v]) => v)) };
      } catch {}
    }
    if (menu?.tagline && !menu.tagline.startsWith("{")) {
      return { ...defaults, tagline: menu.tagline };
    }
    return defaults;
  }, [menu, seasonalTag]);

  const menuPages = useMemo(() => {
    const cats = categories
      .map((cat: any) => ({ ...cat, products: productsToRender.filter((p: any) => p.category_id === cat.id) }))
      .filter((cat: any) => cat.products.length > 0)
      .sort((a: any, b: any) => a.sort_order - b.sort_order);

    const elements: any[] = [];
    cats.forEach((cat: any) => {
      elements.push({ type: 'cat', data: cat });
      cat.products.forEach((p: any) => elements.push({ type: 'item', data: p }));
    });

    const pages: { left: any[]; right: any[] }[] = [];
    let L: any[] = [], R: any[] = [], lh = 0, rh = 0;
    const MAX = 56; // approx mm per column

    const cost = (el: any) => el.type === 'cat' ? 9 : (el.data.description?.length > 40 ? 10 : 6.5);

    for (const el of elements) {
      const c = cost(el);
      const needed = el.type === 'cat' ? c + 6.5 : c;
      if (lh + needed <= MAX) { L.push(el); lh += c; }
      else if (rh + needed <= MAX) { lh = 999; R.push(el); rh += c; }
      else { pages.push({ left: L, right: R }); L = [el]; lh = c; R = []; rh = 0; }
    }
    if (L.length || R.length) pages.push({ left: L, right: R });
    return pages;
  }, [categories, productsToRender]);

  if (catLoading || prodLoading || (id && menuLoading)) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8' }}><Loader2 style={{ color: '#B8963E', width: 28, height: 28, animation: 'spin 1s linear infinite' }} /></div>;
  }

  const theme = menu?.theme || 'classic';
  const waUrl = "https://wa.me/919892290606?text=Hi%20Mezcla!%20I'd%20like%20to%20place%20an%20order.";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(waUrl)}&color=1a1a1a&bgcolor=ffffff&qzone=1&margin=2`;

  const renderEl = (el: any, idx: number) => {
    if (el.type === 'cat') return (
      <div key={`c${el.data.id}${idx}`} className="mi-cat">
        <span>{el.data.name}</span>
      </div>
    );
    const p = el.data;
    const tags = [p.is_vegan && 'V', p.is_gf && 'GF', p.has_nuts && 'N'].filter(Boolean) as string[];
    const price = p.price_label || (p.price != null ? `₹${p.price}` : '—');
    return (
      <div key={`p${p.id ?? idx}${idx}`} className="mi-item">
        <div className="mi-row">
          <span className="mi-name">{p.name}</span>
          {tags.length > 0 && <span className="mi-tags">{tags.join(' · ')}</span>}
          <span className="mi-dots" />
          <span className="mi-price">{price}</span>
        </div>
        {p.description && <p className="mi-desc">{p.description}</p>}
      </div>
    );
  };

  return (
    <div id="mr" className={`t-${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Poppins:wght@300;400;500&family=Great+Vibes&display=swap');

        /* Themes */
        .t-classic { --bg:#F7F2E8; --ink:#22170E; --acc:#B8963E; --muted:#7A6848; --sub:#B5A585; }
        .t-pearl   { --bg:#FAFAFA; --ink:#111111; --acc:#8E7040; --muted:#555555; --sub:#999999; }
        .t-rose    { --bg:#FAF3F0; --ink:#32201E; --acc:#9E5A50; --muted:#7A504A; --sub:#B8908A; }
        .t-sage    { --bg:#F0F2EC; --ink:#1E2A20; --acc:#5E7A52; --muted:#486040; --sub:#8AAA80; }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        #mr {
          font-family: 'Cormorant Garamond', Georgia, serif;
          background: #D8D4CE;
          min-height: 100vh;
          padding: 40px 0 80px;
          color: var(--ink);
        }

        /* ── A4 page ── */
        .pg {
          width: 210mm;
          min-height: 297mm;
          height: 297mm;
          margin: 0 auto 36px;
          background: var(--bg);
          position: relative;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Single thin border — one line, nothing more */
        .pg::before {
          content: '';
          position: absolute;
          inset: 8mm;
          border: 0.75px solid var(--acc);
          opacity: 0.45;
          pointer-events: none;
          z-index: 1;
        }

        /* ── COVER ── */
        .cov {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 18mm 20mm 14mm;
          position: relative;
        }
        .cov-top {
          text-align: center;
          width: 100%;
        }
        .cov-season {
          font-family: 'Poppins', sans-serif;
          font-size: 8pt;
          font-weight: 400;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--sub);
        }
        .cov-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
        }
        .cov-logo {
          width: 62mm;
          height: auto;
          opacity: 0.9;
          margin-bottom: 8mm;
        }
        .cov-name {
          font-family: 'Playfair Display', serif;
          font-size: 34pt;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink);
          line-height: 1.1;
        }
        .cov-rule {
          width: 22mm;
          height: 0.75px;
          background: var(--acc);
          margin: 6mm auto;
        }
        .cov-quote-wrap {
          max-width: 110mm;
          text-align: center;
          margin: 0 auto;
        }
        .cov-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15pt;
          font-weight: 300;
          font-style: italic;
          color: var(--ink);
          line-height: 1.65;
        }
        .cov-author {
          font-family: 'Poppins', sans-serif;
          font-size: 7.5pt;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--sub);
          margin-top: 3mm;
        }
        .cov-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12pt;
          font-style: italic;
          color: var(--muted);
          line-height: 1.7;
          text-align: center;
          max-width: 105mm;
          margin-top: 5mm;
        }
        .cov-bottom {
          text-align: center;
          width: 100%;
        }
        .cov-yr {
          font-family: 'Poppins', sans-serif;
          font-size: 7.5pt;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: var(--sub);
        }

        /* ── MENU PAGES ── */
        .mp {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 12mm 14mm 10mm;
        }
        .mp-head {
          text-align: center;
          margin-bottom: 5mm;
          flex-shrink: 0;
        }
        .mp-title {
          font-family: 'Poppins', sans-serif;
          font-size: 8pt;
          font-weight: 500;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--acc);
        }
        .mp-title-rule {
          width: 100%;
          height: 0.5px;
          background: var(--acc);
          opacity: 0.35;
          margin-top: 2.5mm;
        }
        .mp-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 10mm;
          flex: 1;
          align-items: start;
          min-height: 0;
        }
        .mp-col { display: flex; flex-direction: column; }

        /* Category header */
        .mi-cat {
          padding-bottom: 1.5mm;
          margin-bottom: 3mm;
          margin-top: 6mm;
          border-bottom: 0.5px solid var(--acc);
          opacity: 0.85;
        }
        .mi-cat:first-child { margin-top: 0; }
        .mi-cat span {
          font-family: 'Poppins', sans-serif;
          font-size: 8pt;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--muted);
          display: block;
          text-align: center;
        }

        /* Menu item */
        .mi-item {
          margin-bottom: 4mm;
        }
        .mi-row {
          display: flex;
          align-items: baseline;
          width: 100%;
          gap: 0;
        }
        .mi-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12pt;
          font-weight: 500;
          color: var(--ink);
          letter-spacing: 0.02em;
          white-space: nowrap;
          flex-shrink: 0;
          line-height: 1.25;
        }
        .mi-tags {
          font-family: 'Poppins', sans-serif;
          font-size: 6pt;
          color: var(--acc);
          letter-spacing: 0.08em;
          margin-left: 4px;
          flex-shrink: 0;
          position: relative;
          top: -2px;
        }
        .mi-dots {
          flex: 1;
          border-bottom: 1px dotted var(--sub);
          margin: 0 5px;
          position: relative;
          top: -2px;
          min-width: 6px;
          opacity: 0.5;
        }
        .mi-price {
          font-family: 'Poppins', sans-serif;
          font-size: 10pt;
          font-weight: 400;
          color: var(--muted);
          letter-spacing: 0.04em;
          white-space: nowrap;
          flex-shrink: 0;
          line-height: 1.25;
        }
        .mi-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 9.5pt;
          font-style: italic;
          color: var(--sub);
          line-height: 1.4;
          margin-top: 1mm;
        }

        /* Allergen footer */
        .mp-legend {
          margin-top: auto;
          padding-top: 3.5mm;
          border-top: 0.5px solid var(--sub);
          opacity: 0.5;
          display: flex;
          justify-content: center;
          gap: 6mm;
          flex-shrink: 0;
        }
        .mp-legend span {
          font-family: 'Poppins', sans-serif;
          font-size: 6pt;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .mp-legend b { color: var(--acc); font-weight: 500; margin-right: 2px; }

        /* ── BACK COVER ── */
        .bc {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 16mm 20mm 14mm;
        }
        .bc-logo {
          width: 34mm;
          opacity: 0.65;
        }
        .bc-mid {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 5mm;
          max-width: 120mm;
          flex: 1;
          justify-content: center;
        }
        .bc-ornament {
          color: var(--acc);
          font-size: 16pt;
          opacity: 0.7;
          line-height: 1;
        }
        .bc-msg {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13pt;
          font-style: italic;
          color: var(--ink);
          line-height: 1.9;
          white-space: pre-wrap;
          font-weight: 300;
        }
        .bc-contact {
          width: 100%;
          border-top: 0.5px solid var(--acc);
          opacity: 0.95;
          padding-top: 5.5mm;
        }
        .bc-contact-title {
          font-family: 'Poppins', sans-serif;
          font-size: 8pt;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: var(--muted);
          text-align: center;
          margin-bottom: 4.5mm;
        }
        .bc-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6mm;
        }
        .bc-info { display: flex; flex-direction: column; gap: 3.5mm; }
        .bc-field-label {
          font-family: 'Poppins', sans-serif;
          font-size: 6.5pt;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sub);
          margin-bottom: 0.8mm;
        }
        .bc-field-val {
          font-family: 'Playfair Display', serif;
          font-size: 13pt;
          color: var(--acc);
          letter-spacing: 0.04em;
        }
        .bc-field-val.sm {
          font-size: 10.5pt;
          color: var(--muted);
          font-style: italic;
        }
        .bc-qr { display: flex; flex-direction: column; align-items: center; gap: 2mm; }
        .bc-qr img { display: block; width: 68px; height: 68px; }
        .bc-qr-lbl {
          font-family: 'Poppins', sans-serif;
          font-size: 6pt;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sub);
        }
        .bc-addr {
          text-align: center;
          margin-top: 4mm;
        }
        .bc-addr p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 10pt;
          color: var(--sub);
          line-height: 1.5;
        }
        .bc-web {
          font-family: 'Playfair Display', serif;
          font-size: 11pt;
          font-style: italic;
          color: var(--acc);
          text-align: center;
          margin-top: 2.5mm;
          letter-spacing: 0.04em;
        }

        /* Print button */
        .no-print { display: flex; }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            margin: 0 !important; padding: 0 !important; background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #mr {
            background: transparent !important;
            padding: 0 !important;
          }
          .pg {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
            break-inside: avoid;
          }
          .pg:last-child { page-break-after: auto; break-after: auto; }
          .no-print { display: none !important; }
          aside, header, nav, #TanStackRouterDevtools { display: none !important; }
        }
      `}</style>

      {/* Save PDF button */}
      <div className="no-print" style={{ position:'fixed', bottom:28, right:28, zIndex:50 }}>
        <button
          onClick={() => window.print()}
          style={{
            display:'flex', alignItems:'center', gap:8,
            background:'var(--acc,#B8963E)', color:'white',
            padding:'13px 26px', borderRadius:'50px',
            fontFamily:"'Poppins',sans-serif", fontWeight:500,
            fontSize:'11px', letterSpacing:'0.14em', textTransform:'uppercase',
            boxShadow:'0 6px 28px rgba(0,0,0,0.22)', cursor:'pointer', border:'none',
          }}
        >
          <Printer size={13} /> Save as PDF
        </button>
      </div>

      {/* ═══ COVER PAGE ═══ */}
      <div className="pg">
        <div className="cov">
          <div className="cov-top">
            <p className="cov-season">{meta.tagline}</p>
          </div>

          <div className="cov-center">
            <img src="/logo-transparent.png" alt="Mezcla" className="cov-logo" />
            <h1 className="cov-name">{menu?.name || "Mezcla"}</h1>
            <div className="cov-rule" />
            <div className="cov-quote-wrap">
              <p className="cov-quote">"{meta.quote}"</p>
              <p className="cov-author">{meta.quote_author}</p>
            </div>
            <p className="cov-desc">{meta.cover_text}</p>
          </div>

          <div className="cov-bottom">
            <p className="cov-yr">Bengaluru &nbsp;·&nbsp; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* ═══ MENU CONTENT PAGES ═══ */}
      {menuPages.map((page, pi) => (
        <div key={`pg-${pi}`} className="pg">
          <div className="mp">
            <div className="mp-head">
              <p className="mp-title">{pi === 0 ? "Our Menu" : "Menu · Continued"}</p>
              <div className="mp-title-rule" />
            </div>
            <div className="mp-cols">
              <div className="mp-col">{page.left.map((el, i) => renderEl(el, i))}</div>
              <div className="mp-col">{page.right.map((el, i) => renderEl(el, i))}</div>
            </div>
            {pi === menuPages.length - 1 && (
              <div className="mp-legend">
                <span><b>V</b> Vegan</span>
                <span><b>GF</b> Gluten Free</span>
                <span><b>N</b> Contains Nuts</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* ═══ BACK COVER ═══ */}
      <div className="pg">
        <div className="bc">
          <img src="/logo-transparent.png" alt="Mezcla" className="bc-logo" />

          <div className="bc-mid">
            <span className="bc-ornament">✦</span>
            <p className="bc-msg">{meta.back_text}</p>
            <span className="bc-ornament">✦</span>
          </div>

          <div className="bc-contact">
            <p className="bc-contact-title">Order &amp; Enquiries</p>
            <div className="bc-row">
              <div className="bc-info">
                <div>
                  <p className="bc-field-label">WhatsApp &amp; Phone</p>
                  <p className="bc-field-val">+91 98922 90606</p>
                </div>
                <div>
                  <p className="bc-field-label">Email</p>
                  <p className="bc-field-val sm">hello@mezclakitchen.in</p>
                </div>
              </div>
              <div className="bc-qr">
                <img src={qrUrl} alt="Scan to Order" crossOrigin="anonymous" />
                <p className="bc-qr-lbl">Scan to Order</p>
              </div>
            </div>
            <div className="bc-addr">
              <p>153A, 10th Main Rd, Vikram Nagar, Kumaraswamy Layout, Bengaluru</p>
            </div>
            <p className="bc-web">mezclakitchen.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
