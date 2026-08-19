import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard } from "@/components/admin/ui";
import { Loader2, Check, Gift, PlusCircle, X, ImageIcon, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useHomepageSettings, useSaveHomepageSettings, useProducts, useUpdateProduct } from "@/hooks/useApi";

export const Route = createFileRoute("/admin/festive")({
  head: () => ({ meta: [{ title: "Festive Offers — Mezcla Admin" }] }),
  component: FestivePage,
});

function Field({
  label, value, type = "text", help, icon: Icon, onChange, placeholder,
}: {
  label: string; value: string; type?: string; help?: string; placeholder?: string;
  icon?: React.ElementType; onChange?: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative mt-1.5">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={!onChange}
          placeholder={placeholder}
          className={`w-full h-10 ${Icon ? "pl-9" : "pl-3"} pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 ${!onChange ? "opacity-60 cursor-default" : ""}`}
        />
      </div>
      {help && <span className="block text-xs text-muted-foreground mt-1">{help}</span>}
    </label>
  );
}

// ─── Add Products to Festive Dialog ─────────────────────────────
function AddFestiveDialog({
  allProducts,
  festiveIds,
  onAdd,
  onClose,
}: {
  allProducts: any[];
  festiveIds: Set<string>;
  onAdd: (product: any) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = allProducts.filter(
    (p) =>
      !festiveIds.has(p.id) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-base">Add Product to Festive Collection</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              {search ? "No products match." : "All products are already in the festive collection."}
            </p>
          ) : (
            filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => { onAdd(p); onClose(); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition text-left"
              >
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-10 w-10 rounded-md object-cover shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center shrink-0">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(p.category as any)?.name ?? "Uncategorised"}
                    {p.price != null && ` · ₹${Number(p.price).toLocaleString("en-IN")}`}
                  </div>
                </div>
                <PlusCircle className="h-4 w-4 text-gold shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FestivePage() {
  const homepageQ = useHomepageSettings();
  const saveHomepage = useSaveHomepageSettings();
  const { data: productsData } = useProducts({});
  const updateProduct = useUpdateProduct();

  const [homepage, setHomepage] = useState<any>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (homepageQ.data?.data) {
      setHomepage(homepageQ.data.data);
    }
  }, [homepageQ.data]);

  const setH = (key: string) => (val: any) => setHomepage((p: any) => ({ ...p, [key]: val }));

  async function handleSaveHomepage() {
    const entries = Object.entries(homepage).map(([key, value]) => ({ key, value: String(value ?? ""), type: "text" }));
    await saveHomepage.mutateAsync(entries);
  }

  const allProducts: any[] = productsData?.data ?? [];
  const festiveProducts = allProducts.filter((p) => {
    const tags: string[] = Array.isArray(p.tags) ? p.tags : [];
    return tags.includes("festive");
  });
  const festiveIds = new Set(festiveProducts.map((p) => p.id));

  async function handleAddToFestive(product: any) {
    setAddingId(product.id);
    const currentTags: string[] = Array.isArray(product.tags) ? product.tags : [];
    const newTags = Array.from(new Set([...currentTags, "festive"]));
    try {
      await updateProduct.mutateAsync({ id: product.id, tags: newTags });
    } finally {
      setAddingId(null);
    }
  }

  async function handleRemoveFromFestive(product: any) {
    setRemovingId(product.id);
    const currentTags: string[] = Array.isArray(product.tags) ? product.tags : [];
    const newTags = currentTags.filter((t) => t !== "festive");
    try {
      await updateProduct.mutateAsync({ id: product.id, tags: newTags });
    } finally {
      setRemovingId(null);
    }
  }

  if (homepageQ.isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopHeader title="Festive Offers" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader title="Festive Offers" />
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          <PageHeader
            title="Festive & Special Offers"
            subtitle="Manage festive product listings and homepage section visibility."
          />

          {/* ─── Homepage Toggle & Settings ──────────────────── */}
          <SectionCard
            title="Homepage Configuration"
            action={
              <button onClick={handleSaveHomepage} disabled={saveHomepage.isPending} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60">
                {saveHomepage.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Save
              </button>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h4 className="text-sm font-medium">Enable Festive Section</h4>
                  <p className="text-xs text-muted-foreground">Show or hide the Festive &amp; Special Offers section on the homepage.</p>
                </div>
                <button
                  type="button"
                  disabled={saveHomepage.isPending}
                  onClick={async () => {
                    const nextVal = homepage.festive_enabled === "false" ? "true" : "false";
                    const nextHomepage = { ...homepage, festive_enabled: nextVal };
                    setHomepage(nextHomepage);
                    const entries = Object.entries(nextHomepage).map(([key, value]) => ({ key, value: String(value ?? ""), type: "text" }));
                    await saveHomepage.mutateAsync(entries);
                  }}
                  className={`h-8 px-4 rounded-md text-xs font-semibold border transition-all flex items-center gap-2 ${
                    homepage.festive_enabled !== "false"
                      ? "bg-success/10 text-success border-success/30 hover:bg-success/20"
                      : "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                  }`}
                >
                  {saveHomepage.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  {homepage.festive_enabled !== "false" ? "Enabled (Visible)" : "Disabled (Hidden)"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Section Title" value={homepage.festive_title ?? ""} onChange={setH("festive_title")} placeholder="Festive & Special Offers" />
                <Field label="Section Subtitle" value={homepage.festive_subtitle ?? ""} onChange={setH("festive_subtitle")} placeholder="Thoughtfully curated Hampers & Gifting options." />
                <Field label="CTA Button Text" value={homepage.festive_cta_text ?? ""} onChange={setH("festive_cta_text")} placeholder="Explore Festive Edit" />
                <Field label="CTA Button Link" value={homepage.festive_cta_link ?? ""} onChange={setH("festive_cta_link")} placeholder="/festive" />
              </div>
            </div>
          </SectionCard>

          {/* ─── Festive Product Collection Manager ─────────── */}
          <SectionCard
            title={`Festive Collection (${festiveProducts.length} products)`}
            action={
              <button
                onClick={() => setShowAddDialog(true)}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-semibold hover:opacity-90"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Add Product
              </button>
            }
          >
            <p className="text-xs text-muted-foreground mb-4">
              Products tagged as <code className="px-1 py-0.5 rounded bg-accent text-foreground text-xs">festive</code> appear in the Festive &amp; Special Offers section on the homepage. Toggle them here without editing each product manually.
            </p>
            {festiveProducts.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-border rounded-xl">
                <Gift className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">No festive products yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Product" to tag existing products as festive.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {festiveProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:bg-accent/30 transition">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(p.category as any)?.name ?? "Uncategorised"}
                        {p.price != null && ` · ₹${Number(p.price).toLocaleString("en-IN")}`}
                        {p.is_available === false && <span className="ml-2 text-destructive">· Unavailable</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromFestive(p)}
                      disabled={removingId === p.id}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 border border-destructive/20 transition disabled:opacity-50"
                    >
                      {removingId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Add Product Dialog */}
      {showAddDialog && (
        <AddFestiveDialog
          allProducts={allProducts}
          festiveIds={festiveIds}
          onAdd={handleAddToFestive}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}
