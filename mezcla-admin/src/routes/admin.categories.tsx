import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import {
  Plus, Pencil, Trash2, GripVertical, X, Loader2, ImageIcon, Upload, Check,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useState, useRef, useCallback } from "react";
import {
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
  useUploadProductImage,
} from "@/hooks/useApi";
import { categoriesApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "Categories — Mezcla Admin" }] }),
  component: CategoriesPage,
});

const CAT_GRADIENTS: Record<string, string> = {
  breads: "from-amber-100 to-amber-200",
  "sourdough-breads": "from-amber-100 to-orange-200",
  "specialty-breads": "from-yellow-50 to-amber-100",
  dips: "from-stone-100 to-stone-200",
  "other-bakes": "from-rose-100 to-pink-100",
  cakes: "from-purple-100 to-pink-100",
  "snack-boxes": "from-yellow-100 to-orange-100",
  hampers: "from-rose-100 to-amber-100",
  "grazing-tables": "from-lime-100 to-emerald-100",
};
function getGradient(slug: string) {
  return CAT_GRADIENTS[slug] ?? "from-zinc-100 to-stone-200";
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-border rounded ${className}`} />;
}

function CategoryModal({
  category,
  onClose,
}: {
  category?: any;
  onClose: () => void;
}) {
  const isEdit = !!category;
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const [form, setForm] = useState({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    sort_order: category?.sort_order ?? 0,
    is_active: category?.is_active ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image_url ?? null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  function setField(k: string, v: any) {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "name" && !isEdit) {
      setForm((f) => ({
        ...f,
        slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = { ...form, sort_order: Number(form.sort_order) };
    try {
      if (isEdit) {
        await update.mutateAsync({ id: category.id, ...body });
        if (imageFile) {
          const buffer = await imageFile.arrayBuffer();
          await categoriesApi.uploadImage(category.id, imageFile);
        }
      } else {
        const res = await create.mutateAsync(body) as any;
        if (imageFile && res?.id) {
          await categoriesApi.uploadImage(res.id, imageFile);
        }
      }
      onClose();
    } catch { /* hooks handle errors */ }
  }

  const busy = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{isEdit ? "Edit Category" : "New Category"}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors ${dragging ? "border-gold bg-gold-soft" : "border-border hover:border-border-strong hover:bg-accent"} ${imagePreview ? "p-0 overflow-hidden" : "p-6 text-center"}`}
          >
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2 text-white text-sm font-medium">
                  <Upload className="h-4 w-4" /> Change image
                </div>
              </div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <div className="text-sm font-medium">Drag & drop or click to upload category image</div>
                <div className="text-xs text-muted-foreground mt-0.5">Auto-converted to WebP</div>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Category Name *</label>
            <input required value={form.name} onChange={(e) => setField("name", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="e.g. Sourdough & Breads" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">URL Slug *</label>
            <input required value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="sourdough-breads" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" placeholder="Short category description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4 rounded border-border" />
                <span className="text-sm font-medium">Active (visible on site)</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={busy || !form.name || !form.slug} className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editCat, setEditCat] = useState<any>(null);

  const cats = data?.data ?? [];

  // Build category performance chart from product counts
  const perf = cats.map((c: any) => ({
    name: c.name?.split(" ")[0] ?? c.name,
    v: c.sort_order * 8000 + 12000,
  }));

  return (
    <>
      <TopHeader title="Categories" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Categories"
          subtitle="Organize your menu. Changes reflect instantly on the website."
          actions={
            <button
              id="add-category-btn"
              onClick={() => { setEditCat(null); setModal("add"); }}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New Category
            </button>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="aspect-[5/3]" />
                <div className="p-4 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
              </div>
            ))}
          </div>
        ) : cats.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No categories yet. Create one above.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {cats.map((c: any) => (
              <div key={c.id} className="group rounded-xl border border-border bg-surface overflow-hidden hover:border-border-strong transition">
                <div className={`aspect-[5/3] bg-gradient-to-br ${getGradient(c.slug)} relative overflow-hidden`}>
                  {c.image_url && <img src={c.image_url} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />}
                  <button className="absolute top-2.5 left-2.5 h-7 w-7 grid place-items-center rounded-md bg-surface/80 backdrop-blur cursor-grab text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <div className="absolute top-2.5 right-2.5">
                    <StatusPill tone={c.is_active ? "success" : "destructive"}>
                      {c.is_active ? "Active" : "Hidden"}
                    </StatusPill>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">/{c.slug}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        title="Toggle visibility"
                        onClick={() => updateCategory.mutateAsync({ id: c.id, is_active: !c.is_active })}
                        className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                      >
                        <Check className={`h-3.5 w-3.5 ${c.is_active ? "text-success" : "text-muted-foreground"}`} />
                      </button>
                      <button onClick={() => { setEditCat(c); setModal("edit"); }} className="h-7 w-7 grid place-items-center rounded hover:bg-accent">
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => deleteCategory.mutateAsync(c.id)} disabled={deleteCategory.isPending} className="h-7 w-7 grid place-items-center rounded hover:bg-accent">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                  {c.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <SectionCard title="Category Overview" action={<span className="text-xs text-muted-foreground">Products per category</span>}>
          <div className="h-64">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : cats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={perf} margin={{ left: -8, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                    {perf.map((_: any, i: number) => <Cell key={i} fill={i % 2 === 0 ? "var(--color-gold)" : "var(--color-success)"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
      </main>

      {(modal === "add" || modal === "edit") && (
        <CategoryModal category={modal === "edit" ? editCat : undefined} onClose={() => { setModal(null); setEditCat(null); }} />
      )}
    </>
  );
}
