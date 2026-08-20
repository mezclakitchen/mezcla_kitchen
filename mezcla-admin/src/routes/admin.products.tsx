import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import {
  Package, CheckCircle2, AlertTriangle, Search, Filter, Plus, Pencil, Trash2,
  PowerOff, X, Upload, Loader2, ImageIcon, Tag, TableProperties, LayoutGrid, Save, EyeOff, Eye,
  PlusCircle, MinusCircle, Layers,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import {
  useProducts, useCategories, useCreateProduct, useUpdateProduct,
  useDeleteProduct, useUploadProductImage,
  useUploadProductGalleryImage, useDeleteProductGalleryImage,
} from "@/hooks/useApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Mezcla Admin" }] }),
  component: ProductsPage,
});

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-border rounded ${className}`} />;
}

// ─── Variant type ────────────────────────────────────────────────
interface Variant {
  name: string;
  price: number | null;
  price_label: string;
}

// ─── Product Modal ─────────────────────────────────────────────
function ProductModal({
  product,
  categories,
  onClose,
}: {
  product?: any;
  categories: any[];
  onClose: () => void;
}) {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadProductImage();
  const uploadGalleryImage = useUploadProductGalleryImage();
  const deleteGalleryImage = useDeleteProductGalleryImage();

  const existingVariants: Variant[] = Array.isArray(product?.variants) ? product.variants : [];

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    price_label: product?.price_label ?? "",
    show_price: product?.show_price ?? true,
    category_id: product?.category_id ?? "",
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    sort_order: product?.sort_order ?? 0,
    meta_title: product?.meta_title ?? "",
    meta_desc: product?.meta_desc ?? "",
    tags: (product?.tags ?? []).join(", "),
  });
  const [variants, setVariants] = useState<Variant[]>(
    existingVariants.length > 0 ? existingVariants : []
  );
  
  // Combine existing primary image and gallery images
  const existingImages = [];
  if (product?.image_url) existingImages.push(product.image_url);
  if (Array.isArray(product?.images)) existingImages.push(...product.images);

  const [pendingImages, setPendingImages] = useState<{ file: File; preview: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "name" && !isEdit) {
      setForm((f) => ({
        ...f,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }

  // ─── Variant helpers ─────────────────────────────────────────
  function addVariant() {
    setVariants((v) => [...v, { name: "", price: null, price_label: "" }]);
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof Variant, value: string | number | null) {
    setVariants((v) => v.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  function handleFiles(files: FileList) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please upload image files only");
      return;
    }
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingImages((prev) => [...prev, { file, preview: e.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, []);

  async function handleDeleteExisting(url: string) {
    if (!product?.id) return;
    try {
      await deleteGalleryImage.mutateAsync({ id: product.id, url });
    } catch { /* error handled by hook */ }
  }

  function handleRemovePending(index: number) {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ...form,
      price: form.price ? Number(form.price) : null,
      sort_order: Number(form.sort_order),
      tags: form.tags ? form.tags.split(",").map((t: any) => t.trim()).filter(Boolean) : [],
      category_id: form.category_id || null,
      variants: variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          name: v.name.trim(),
          price: v.price != null && v.price !== ("" as any) ? Number(v.price) : null,
          price_label: v.price_label?.trim() || null,
        })),
    };

    try {
      let productId = product?.id;
      
      if (isEdit) {
        const { data: updated } = await updateProduct.mutateAsync({ id: product.id, ...body }) as any;
        if (updated?.id) productId = updated.id;
      } else {
        const { data: created } = await createProduct.mutateAsync(body) as any;
        if (created?.id) productId = created.id;
      }
      
      // Upload pending images one by one
      if (productId && pendingImages.length > 0) {
        for (const { file } of pendingImages) {
          await uploadGalleryImage.mutateAsync({ id: productId, file });
        }
      }
      
      onClose();
    } catch { /* errors handled by hooks */ }
  }

  const busy = createProduct.isPending || updateProduct.isPending || uploadGalleryImage.isPending || deleteGalleryImage.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image upload */}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              Product Images
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {/* Existing Images */}
              {existingImages.map((url, i) => (
                <div key={url} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-accent/50">
                  <img src={url} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(url)}
                      className="h-8 w-8 rounded-full bg-red-500/90 text-white grid place-items-center hover:bg-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pending Images */}
              {pendingImages.map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gold/50 bg-gold-soft/20">
                  <img src={img.preview} alt="Pending" className="w-full h-full object-cover opacity-70 grayscale-[30%]" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemovePending(i)}
                      className="h-8 w-8 rounded-full bg-red-500/90 text-white grid place-items-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="bg-black/60 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">Pending</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors p-8 ${
                dragging ? "border-gold bg-gold-soft" : "border-border hover:border-border-strong hover:bg-accent"
              }`}
            >
              <div className="text-center">
                <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm font-medium">Drag & drop or click to add images</div>
                <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP — max 5MB · Auto-converted to WebP</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="e.g. Sourdough Multigrain Boule"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">URL Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="sourdough-multigrain-boule"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
              <select
                required
                value={form.category_id}
                onChange={(e) => setField("category_id", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">No Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Base Price (used when no variants, or as "starting from") */}
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Base Price (₹) {variants.length > 0 && <span className="text-gold">(used as "From" price)</span>}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    className="w-full h-10 pl-8 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                    placeholder="e.g. 480"
                  />
                </div>
              </div>

              {/* Show/Hide price toggle */}
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Show Price on Website?</label>
                <button
                  type="button"
                  onClick={() => setField("show_price", !form.show_price)}
                  className={`w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                    form.show_price
                      ? "bg-success/10 text-success border-success/30"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  }`}
                >
                  {form.show_price ? (
                    <><Eye className="h-4 w-4" /> Visible on site</>
                  ) : (
                    <><EyeOff className="h-4 w-4" /> Hidden from site</>
                  )}
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                placeholder="Product description…"
              />
            </div>

            {/* ─── Product Variants ──────────────────────────────────── */}
            <div className="col-span-2 border border-border rounded-xl p-4 bg-accent/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gold" />
                  <span className="text-sm font-semibold">Product Variants</span>
                  <span className="text-xs text-muted-foreground">(sizes, flour types, etc.)</span>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 border border-gold/30 transition"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Add Variant
                </button>
              </div>

              {variants.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">
                  No variants — product has a single price. Add variants for sizes (e.g. 2 Cups / 6 Cups) or flour type (Whole Wheat / Maida).
                </p>
              ) : (
                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-center">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => updateVariant(i, "name", e.target.value)}
                        placeholder="Variant name (e.g. 2 Mini Cups, Whole Wheat)"
                        className="h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                      />
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={v.price ?? ""}
                          onChange={(e) => updateVariant(i, "price", e.target.value === "" ? null : Number(e.target.value))}
                          placeholder="Price"
                          className="w-full h-9 pl-6 pr-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                        />
                      </div>
                      <input
                        type="text"
                        value={v.price_label}
                        onChange={(e) => updateVariant(i, "price_label", e.target.value)}
                        placeholder="Label"
                        className="h-9 px-2 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring/30"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive transition"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">
                    Customers will see these as options before enquiring on WhatsApp.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setField("tags", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="vegan, sourdough, gluten-free"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setField("sort_order", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">SEO Meta Title</label>
              <input
                value={form.meta_title}
                onChange={(e) => setField("meta_title", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="For Google search results"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">SEO Meta Description</label>
              <textarea
                value={form.meta_desc}
                onChange={(e) => setField("meta_desc", e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                placeholder="For Google search results (140–160 chars)"
              />
            </div>
            {/* Toggles */}
            <div className="col-span-2 flex flex-wrap gap-6 border-t border-border pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) => setField("is_available", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                />
                <span className="text-sm font-medium">Available for purchase</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_price}
                  onChange={(e) => setField("show_price", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                />
                <span className="text-sm font-medium flex items-center gap-1.5">
                  {form.show_price ? <Eye className="h-4 w-4 text-muted-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  Show Price publicly
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setField("is_featured", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                />
                <span className="text-sm font-medium">Featured on homepage</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer mt-2 sm:mt-0 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={typeof form.tags === 'string' ? form.tags.includes("festive") : false}
                  onChange={(e) => {
                    const currentTags = typeof form.tags === 'string' ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                    const tagsSet = new Set(currentTags);
                    if (e.target.checked) tagsSet.add("festive");
                    else tagsSet.delete("festive");
                    setField("tags", Array.from(tagsSet).join(", "));
                  }}
                  className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                />
                <span className="text-sm font-medium text-gold">🎁 Include in Festive & Special Offers section</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-lg border border-border bg-surface text-sm font-medium hover:bg-accent">
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !form.name || !form.slug || !form.category_id}
              className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Inline Pricing Table Row (SIMPLIFIED) ───────────────────
function PricingTableRow({ product }: { product: any }) {
  const updateProduct = useUpdateProduct();
  const [price, setPrice] = useState<string>(product.price != null ? String(product.price) : "");
  const [showPrice, setShowPrice] = useState<boolean>(product.show_price !== false);
  const [savedPrice, setSavedPrice] = useState<string>(product.price != null ? String(product.price) : "");

  const priceChanged = price !== savedPrice;

  async function handleSave() {
    await updateProduct.mutateAsync({
      id: product.id,
      price: price !== "" ? Number(price) : null,
      price_label: null,
    });
    setSavedPrice(price);
  }

  async function handleToggle() {
    const next = !showPrice;
    setShowPrice(next);
    await updateProduct.mutateAsync({ id: product.id, show_price: next });
  }

  const variants: Variant[] = Array.isArray(product.variants) ? product.variants : [];

  return (
    <tr className="border-b border-border hover:bg-accent/30 transition">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {product.image_url ? (
            <img src={product.image_url} alt="" className="h-10 w-10 rounded-md object-cover shrink-0" />
          ) : (
            <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center shrink-0">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium text-sm">{product.name}</div>
            <div className="text-xs text-muted-foreground">{(product.category as any)?.name ?? "Uncategorised"}</div>
            {variants.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {variants.map((v, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                    {v.name}{v.price ? ` ₹${v.price}` : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 w-44">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={variants.length > 0 ? "From price" : "Enter price"}
            className="w-full h-10 pl-8 pr-3 rounded-lg border border-border bg-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
          />
        </div>
      </td>

      <td className="px-4 w-40">
        <button
          onClick={handleToggle}
          disabled={updateProduct.isPending}
          className={`w-full h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            showPrice
              ? "bg-success/10 text-success border border-success/30 hover:bg-success/20"
              : "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20"
          }`}
        >
          {showPrice ? (
            <><Eye className="h-4 w-4" /> Visible</>
          ) : (
            <><EyeOff className="h-4 w-4" /> Hidden</>
          )}
        </button>
      </td>

      <td className="px-4 text-right w-28">
        {priceChanged ? (
          <button
            onClick={handleSave}
            disabled={updateProduct.isPending}
            className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-gold text-gold-foreground text-sm font-bold hover:opacity-90 disabled:opacity-50 gap-2"
          >
            {updateProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </button>
        ) : (
          <span className="text-xs text-muted-foreground font-medium">
            {savedPrice ? `₹${Number(savedPrice).toLocaleString("en-IN")}` : "— no price"}
          </span>
        )}
      </td>
    </tr>
  );
}

// ─── Main Products Page ────────────────────────────────────────
function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const { data: productsData, isLoading } = useProducts({
    search: search || undefined,
    category: categoryFilter || undefined,
  });
  const { data: catData } = useCategories();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const products = productsData?.data ?? [];
  const categories = catData?.data ?? [];

  const active = products.filter((p: any) => p.is_available).length;
  const outOfStock = products.filter((p: any) => !p.is_available).length;

  async function handleToggle(product: any) {
    await updateProduct.mutateAsync({ id: product.id, is_available: !product.is_available });
  }

  async function handleDelete(product: any) {
    await deleteProduct.mutateAsync(product.id);
    setDeleteConfirm(null);
  }

  return (
    <>
      <TopHeader title="Products" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Product Catalogue"
          subtitle="Manage your artisanal lineup — breads, dips, hampers and more."
          actions={
            <div className="flex items-center gap-3">
              <div className="flex bg-surface border border-border p-0.5 rounded-lg mr-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 h-8 px-3 rounded-md text-sm font-medium transition ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
                >
                  <LayoutGrid className="h-4 w-4" /> Gallery
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-2 h-8 px-3 rounded-md text-sm font-medium transition ${viewMode === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
                >
                  <TableProperties className="h-4 w-4" /> Pricing View
                </button>
              </div>
              <button
                id="add-product-btn"
                onClick={() => { setEditProduct(null); setModal("add"); }}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total Products" value={String(products.length)} icon={Package} change="" accent="primary" />
          <KpiCard label="Active" value={String(active)} icon={CheckCircle2} change="" accent="success" />
          <KpiCard label="Out of Stock" value={String(outOfStock)} icon={AlertTriangle} change="" trend={outOfStock > 0 ? "down" : "up"} accent={outOfStock > 0 ? "destructive" : "success"} />
          <KpiCard label="Categories" value={String(categories.length)} icon={Tag} change="" accent="gold" />
        </div>

        <SectionCard>
          <div className="flex flex-wrap items-center gap-2 -mt-1 mb-5">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No products found. Add your first product above.</p>
            </div>
          ) : viewMode === "grid" ? (
            // GRID VIEW
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p: any) => {
                const variants: Variant[] = Array.isArray(p.variants) ? p.variants : [];
                return (
                  <div key={p.id} className="group rounded-xl border border-border bg-surface overflow-hidden hover:border-border-strong transition">
                    <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                        <StatusPill tone={p.is_available ? "success" : "destructive"}>
                          {p.is_available ? "Active" : "Unavailable"}
                        </StatusPill>
                        {p.show_price === false && (
                          <StatusPill tone="warning">Price Hidden</StatusPill>
                        )}
                        {variants.length > 0 && (
                          <StatusPill tone="neutral">{variants.length} Variants</StatusPill>
                        )}
                      </div>
                      {p.is_featured && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[10px] uppercase tracking-wider rounded-full bg-gold/90 text-gold-foreground px-2 py-0.5 font-medium shadow-sm">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground">
                        {(p.categories as any)?.name ?? "Uncategorised"}
                      </div>
                      <div className="font-medium truncate mt-0.5 text-sm">{p.name}</div>
                      {variants.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {variants.slice(0, 3).map((v, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                              {v.name}
                            </span>
                          ))}
                          {variants.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{variants.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-display text-base text-gold">
                            {p.show_price === false
                              ? <span className="text-muted-foreground/50 text-sm italic">Price Hidden</span>
                              : p.price != null
                                ? `₹${Number(p.price).toLocaleString("en-IN")}`
                                : p.price_label || <span className="text-muted-foreground/50 text-sm">No price set</span>
                            }
                          </span>
                        </div>
                      )}
                      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          title="Edit"
                          onClick={() => { setEditProduct(p); setModal("edit"); }}
                          className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button
                          title={p.is_available ? "Disable" : "Enable"}
                          onClick={() => handleToggle(p)}
                          className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                        >
                          <PowerOff className={`h-3.5 w-3.5 ${p.is_available ? "text-muted-foreground" : "text-success"}`} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleteConfirm(p)}
                          className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // TABLE PRICING VIEW
            <div className="border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium w-44">Price (₹)</th>
                    <th className="px-4 py-3 font-medium w-40">Show on Website</th>
                    <th className="px-4 py-3 font-medium w-28 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <PricingTableRow key={p.id} product={p} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </main>

      {/* Product Modal */}
      {(modal === "add" || modal === "edit") && (
        <ProductModal
          product={modal === "edit" ? editProduct : undefined}
          categories={categories}
          onClose={() => { setModal(null); setEditProduct(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface border border-border p-6 shadow-2xl">
            <h3 className="font-display text-lg mb-2">Delete Product?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This will also delete all product images. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteProduct.isPending}
                className="flex-1 h-10 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleteProduct.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
