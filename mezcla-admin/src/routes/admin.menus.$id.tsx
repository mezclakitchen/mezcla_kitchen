import { createFileRoute, Link } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { ArrowLeft, Loader2, Plus, Trash2, Search, Save, ChevronDown, ChevronUp, Leaf, Wheat, Nut, PenLine, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMenu, useProducts, useUpdateMenuItems } from "@/hooks/useApi";

export const Route = createFileRoute("/admin/menus/$id")({
  head: () => ({ meta: [{ title: "Menu Builder — Mezcla Admin" }] }),
  component: MenuBuilderPage,
});

// ─── Types ────────────────────────────────────────────────────
interface MenuItem {
  _key: string;
  product_id: string | null;   // null = custom item
  custom_name: string | null;  // only for custom items
  custom_price: number | null;
  custom_price_label: string | null;
  is_vegan: boolean;
  is_gf: boolean;
  has_nuts: boolean;
  products?: any;              // populated for DB products
}

// ─── Quick-Add Modal (for catalogue products) ─────────────────
function ProductModal({
  product,
  onConfirm,
  onClose,
}: {
  product: any;
  onConfirm: (overrides: Partial<MenuItem>) => void;
  onClose: () => void;
}) {
  const [price, setPrice] = useState(product.price?.toString() ?? "");
  const [label, setLabel] = useState(product.price_label ?? "");
  const [isVegan, setIsVegan] = useState(false);
  const [isGF, setIsGF] = useState(false);
  const [hasNuts, setHasNuts] = useState(false);

  useEffect(() => {
    const n = product.name.toLowerCase();
    setIsVegan(n.includes("sourdough") || n.includes("hummus") || n.includes("vegan"));
    setIsGF(n.includes("gluten") || n.includes("gf"));
    setHasNuts(n.includes("nut") || n.includes("pistachio") || n.includes("almond"));
  }, [product]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.category?.name ?? "Uncategorised"}</p>
            <h2 className="text-lg font-semibold mt-0.5">{product.name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="h-4 w-4" /></button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Price for this Menu</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <input type="number" placeholder={product.price ?? "Amount"} value={price}
                onChange={(e) => { setPrice(e.target.value); setLabel(""); }}
                className="w-full h-10 pl-7 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <input type="text" placeholder='e.g. "From ₹250"' value={label}
              onChange={(e) => { setLabel(e.target.value); setPrice(""); }}
              className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Leave blank to use the product's default price.</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Diet Tags</label>
          <div className="flex gap-2">
            {[
              { key: "V", label: "Vegan", icon: <Leaf className="h-3.5 w-3.5" />, value: isVegan, set: setIsVegan },
              { key: "GF", label: "Gluten-Free", icon: <Wheat className="h-3.5 w-3.5" />, value: isGF, set: setIsGF },
              { key: "N", label: "Nuts", icon: <Nut className="h-3.5 w-3.5" />, value: hasNuts, set: setHasNuts },
            ].map((t) => (
              <button key={t.key} type="button" onClick={() => t.set(!t.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all ${t.value ? "border-gold bg-gold/10 text-gold" : "border-border bg-background text-muted-foreground hover:border-gold/40"}`}>
                {t.icon}
                <span className="text-[9px] font-bold uppercase">({t.key})</span>
                <span className="text-[8px]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition">Cancel</button>
          <button
            onClick={() => onConfirm({ custom_price: price ? Number(price) : null, custom_price_label: label || null, is_vegan: isVegan, is_gf: isGF, has_nuts: hasNuts })}
            className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Add to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Item Modal (for items not in catalogue) ────────────
function CustomItemModal({ onConfirm, onClose }: { onConfirm: (item: Partial<MenuItem>) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [label, setLabel] = useState("");
  const [isVegan, setIsVegan] = useState(false);
  const [isGF, setIsGF] = useState(false);
  const [hasNuts, setHasNuts] = useState(false);

  const canSubmit = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Add Custom Item</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Add something that isn't in your product catalogue.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="h-4 w-4" /></button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Item Name *</label>
          <input type="text" placeholder="e.g. Chef's Special Sourdough" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Price</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
              <input type="number" placeholder="Amount" value={price}
                onChange={(e) => { setPrice(e.target.value); setLabel(""); }}
                className="w-full h-10 pl-7 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <input type="text" placeholder='or "From ₹250"' value={label}
              onChange={(e) => { setLabel(e.target.value); setPrice(""); }}
              className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Diet Tags</label>
          <div className="flex gap-2">
            {[
              { key: "V", label: "Vegan", icon: <Leaf className="h-3.5 w-3.5" />, value: isVegan, set: setIsVegan },
              { key: "GF", label: "GF", icon: <Wheat className="h-3.5 w-3.5" />, value: isGF, set: setIsGF },
              { key: "N", label: "Nuts", icon: <Nut className="h-3.5 w-3.5" />, value: hasNuts, set: setHasNuts },
            ].map((t) => (
              <button key={t.key} type="button" onClick={() => t.set(!t.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all ${t.value ? "border-gold bg-gold/10 text-gold" : "border-border bg-background text-muted-foreground hover:border-gold/40"}`}>
                {t.icon}
                <span className="text-[9px] font-bold uppercase">({t.key})</span>
                <span className="text-[8px]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition">Cancel</button>
          <button disabled={!canSubmit}
            onClick={() => onConfirm({ product_id: null, custom_name: name.trim(), custom_price: price ? Number(price) : null, custom_price_label: label || null, is_vegan: isVegan, is_gf: isGF, has_nuts: hasNuts })}
            className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Add to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline Row ────────────────────────────────────────────────
function MenuItemRow({
  item, index, isFirst, isLast,
  onUpdate, onRemove, onMoveUp, onMoveDown,
}: {
  item: MenuItem; index: number; isFirst: boolean; isLast: boolean;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = item.custom_name ?? item.products?.name ?? "Unknown";
  const category = item.products?.categories?.name;
  const basePrice = item.products?.price;
  const basePriceLabel = item.products?.price_label;

  const displayPrice = item.custom_price_label
    ? item.custom_price_label
    : item.custom_price != null
    ? `₹${item.custom_price}`
    : basePriceLabel || (basePrice ? `₹${basePrice}` : "—");

  const activeTags = [item.is_vegan && "V", item.is_gf && "GF", item.has_nuts && "N"].filter(Boolean);

  return (
    <div className={`bg-background border rounded-xl overflow-hidden transition-all ${expanded ? "border-gold/40 shadow-sm" : "border-border"}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex flex-col gap-0 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst} className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5 transition">
            <ChevronUp className="h-3 w-3" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="text-muted-foreground hover:text-foreground disabled:opacity-20 p-0.5 transition">
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <span className="text-[10px] text-muted-foreground font-mono w-4 shrink-0 text-center">{index + 1}</span>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm truncate">{name}</span>
            {item.custom_name && !item.products && (
              <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground bg-accent px-1.5 py-0.5 rounded">Custom</span>
            )}
            {activeTags.length > 0 && (
              <span className="shrink-0 text-[9px] font-bold tracking-wider text-gold border border-gold/40 rounded px-1 py-0.5 bg-gold/5">
                {activeTags.join(" · ")}
              </span>
            )}
          </div>
          {category && <div className="text-[11px] text-muted-foreground">{category}</div>}
        </div>

        <span className="text-sm font-semibold text-gold shrink-0">{displayPrice}</span>

        <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground transition p-1 shrink-0" title="Edit">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition p-1 shrink-0">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border bg-accent/10 px-4 py-3 space-y-3">
          {/* Name override for custom items */}
          {item.custom_name && !item.products && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Item Name</label>
              <input type="text" value={item.custom_name || ""} onChange={(e) => onUpdate("custom_name", e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-gold/40" />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Price Override</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                <input type="number" placeholder="Amount" value={item.custom_price || ""}
                  onChange={(e) => { onUpdate("custom_price", e.target.value ? Number(e.target.value) : null); if (e.target.value) onUpdate("custom_price_label", null); }}
                  className="w-full h-8 pl-5 pr-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <input type="text" placeholder='Custom label e.g. "From ₹250"' value={item.custom_price_label || ""}
                onChange={(e) => { onUpdate("custom_price_label", e.target.value || null); if (e.target.value) onUpdate("custom_price", null); }}
                className="flex-1 h-8 px-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-gold/40" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Diet Tags</label>
            <div className="flex gap-2">
              {[
                { key: "is_vegan", label: "V Vegan", value: item.is_vegan },
                { key: "is_gf", label: "GF Gluten-Free", value: item.is_gf },
                { key: "has_nuts", label: "N Nuts", value: item.has_nuts },
              ].map((t) => (
                <button key={t.key} type="button" onClick={() => onUpdate(t.key, !t.value)}
                  className={`h-7 px-2.5 rounded-md text-[10px] font-bold border transition-all ${t.value ? "border-gold bg-gold/15 text-gold" : "border-border text-muted-foreground hover:border-gold/40"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
function MenuBuilderPage() {
  const { id } = Route.useParams();
  const { data: menuData, isLoading: menuLoading } = useMenu(id);
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const updateItems = useUpdateMenuItems();

  const menu = menuData?.data;
  const allProducts: any[] = productsData?.data ?? [];

  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [addingProduct, setAddingProduct] = useState<any | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    if (menu?.items) {
      setSelectedItems(menu.items.map((item: any) => ({
        ...item,
        _key: item.id || crypto.randomUUID(),
        custom_name: item.custom_name ?? null,
      })));
    }
  }, [menu]);

  const handleConfirmAddProduct = (product: any, overrides: Partial<MenuItem>) => {
    setSelectedItems((prev) => [
      ...prev,
      { _key: crypto.randomUUID(), product_id: product.id, custom_name: null, custom_price: null, custom_price_label: null, is_vegan: false, is_gf: false, has_nuts: false, products: product, ...overrides },
    ]);
    setIsDirty(true);
    setAddingProduct(null);
  };

  const handleConfirmCustom = (item: Partial<MenuItem>) => {
    setSelectedItems((prev) => [
      ...prev,
      { _key: crypto.randomUUID(), product_id: null, custom_price: null, custom_price_label: null, is_vegan: false, is_gf: false, has_nuts: false, ...item } as MenuItem,
    ]);
    setIsDirty(true);
    setShowCustomModal(false);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setSelectedItems((prev) => { const n = [...prev]; n[index] = { ...n[index], [field]: value }; return n; });
    setIsDirty(true);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSelectedItems((prev) => { const n = [...prev]; [n[index - 1], n[index]] = [n[index], n[index - 1]]; return n; });
    setIsDirty(true);
  };

  const handleMoveDown = (index: number) => {
    setSelectedItems((prev) => { if (index >= prev.length - 1) return prev; const n = [...prev]; [n[index + 1], n[index]] = [n[index], n[index + 1]]; return n; });
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateItems.mutateAsync({ id, items: selectedItems });
      setIsDirty(false);
    } catch { /* handled by hook */ }
  };

  if (menuLoading || productsLoading) {
    return <div className="h-full flex items-center justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  if (!menu) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Menu not found.</p>
        <Link to="/admin/menus" className="text-gold mt-4 inline-block hover:underline">← Return to Menus</Link>
      </div>
    );
  }

  const selectedProductIds = new Set(selectedItems.filter((i) => i.product_id).map((i) => i.product_id));
  const filteredProducts = allProducts.filter(
    (p: any) => p.is_available && (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  // Group for catalogue display
  const grouped = filteredProducts.reduce((acc: Record<string, any[]>, p: any) => {
    const cat = p.categories?.name ?? "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  let parsedTagline = menu?.tagline ?? "No tagline";
  if (menu?.tagline?.startsWith("{")) {
    try {
      parsedTagline = JSON.parse(menu.tagline).tagline || "No tagline";
    } catch (e) {
      // ignore
    }
  }

  return (
    <>
      <TopHeader title="Menu Builder" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Back */}
          <Link to="/admin/menus" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 mb-5 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Menus
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold">{menu.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {parsedTagline} · Theme: <span className="capitalize font-medium">{menu.theme}</span>
                {isDirty && <span className="ml-2 text-amber-500 font-medium">· Unsaved changes</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href={`/admin/menu?id=${menu.id}`} target="_blank"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-gold text-gold text-sm font-medium hover:bg-gold/10 transition">
                Preview PDF ↗
              </a>
              <button onClick={handleSave} disabled={!isDirty || updateItems.isPending}
                className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
                {updateItems.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isDirty ? "Save Changes" : "Saved ✓"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ── LEFT: Menu Order ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-base">Menu Order</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Exact order items appear in the PDF. Click any item to edit price & tags.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">{selectedItems.length} items</span>
                  <button onClick={() => setShowCustomModal(true)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-dashed border-gold/50 text-gold text-xs font-medium hover:bg-gold/10 transition">
                    <PenLine className="h-3 w-3" /> Custom Item
                  </button>
                </div>
              </div>

              {selectedItems.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-2xl py-14 flex flex-col items-center text-muted-foreground text-sm">
                  <p className="font-medium">No items yet.</p>
                  <p className="text-xs mt-1 text-center">Pick products from the right panel, <br />or add a custom item using the button above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((item, index) => (
                    <MenuItemRow key={item._key} item={item} index={index}
                      isFirst={index === 0} isLast={index === selectedItems.length - 1}
                      onUpdate={(field, value) => handleUpdateItem(index, field, value)}
                      onRemove={() => handleRemoveItem(index)}
                      onMoveUp={() => handleMoveUp(index)}
                      onMoveDown={() => handleMoveDown(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Catalogue ── */}
            <div className="lg:sticky lg:top-6">
              <div className="mb-3">
                <h2 className="font-semibold text-base">Product Catalogue</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Click any product to set price & tags, then add it to the menu.</p>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {Object.entries(grouped).map(([cat, products]) => (
                  <div key={cat}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1 mb-1.5">{cat}</p>
                    <div className="space-y-1.5">
                      {(products as any[]).map((p: any) => {
                        const isAdded = selectedProductIds.has(p.id);
                        return (
                          <button key={p.id} onClick={() => setAddingProduct(p)}
                            className={`w-full flex items-center justify-between bg-surface border rounded-xl px-4 py-3 text-left transition-all group ${isAdded ? "border-gold/30 bg-gold/5" : "border-border hover:border-gold/50 hover:bg-gold/5"}`}>
                            <div className="min-w-0">
                              <div className={`font-medium text-sm truncate transition ${isAdded ? "text-gold" : "text-foreground group-hover:text-gold"}`}>{p.name}</div>
                              {p.description && <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[200px]">{p.description}</div>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className="text-xs text-muted-foreground">{p.price_label || (p.price ? `₹${p.price}` : "—")}</span>
                              {isAdded ? (
                                <span className="text-[10px] font-bold text-gold bg-gold/10 border border-gold/30 rounded-full px-2 py-0.5">✓ Added</span>
                              ) : (
                                <span className="h-7 w-7 rounded-full bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition">
                                  <Plus className="h-3.5 w-3.5" />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {Object.keys(grouped).length === 0 && (
                  <div className="py-10 text-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-2xl">
                    {search ? `No products match "${search}"` : "No products found in catalogue."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {addingProduct && (
        <ProductModal product={addingProduct}
          onConfirm={(overrides) => handleConfirmAddProduct(addingProduct, overrides)}
          onClose={() => setAddingProduct(null)} />
      )}
      {showCustomModal && (
        <CustomItemModal onConfirm={handleConfirmCustom} onClose={() => setShowCustomModal(false)} />
      )}
    </>
  );
}
