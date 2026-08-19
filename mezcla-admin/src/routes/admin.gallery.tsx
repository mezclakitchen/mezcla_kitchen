import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard } from "@/components/admin/ui";
import { Images, Upload, Trash2, Loader2, ImageIcon, Filter, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useGallery, useUploadGalleryImage, useDeleteGalleryImage } from "@/hooks/useApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({ meta: [{ title: "Gallery — Mezcla Admin" }] }),
  component: GalleryPage,
});

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "general", label: "General" },
  { value: "breads", label: "Breads" },
  { value: "dips", label: "Dips" },
  { value: "grazing", label: "Grazing" },
  { value: "hampers", label: "Hampers" },
  { value: "snack-boxes", label: "Snack Boxes" },
];

function GalleryPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState("general");
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<{ file: File; preview: string }[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useGallery(categoryFilter || undefined);
  const uploadImage = useUploadGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const images = data?.data ?? [];

  function handleFiles(files: FileList) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please upload image files only");
      return;
    }
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPending((prev) => [...prev, { file, preview: e.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }, []);

  async function handleUploadAll() {
    if (pending.length === 0) {
      toast.error("No images selected");
      return;
    }
    for (const { file } of pending) {
      await uploadImage.mutateAsync({ file, caption: uploadCaption, category: uploadCategory });
    }
    setPending([]);
    setUploadCaption("");
  }

  return (
    <>
      <TopHeader title="Gallery" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Image Gallery"
          subtitle="Upload and manage images shown on your website."
          actions={
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Images className="h-4 w-4" /> {images.length} images
            </div>
          }
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Upload Panel */}
          <SectionCard title="Upload Images">
            {/* Drag-and-drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed transition-all p-6 text-center ${
                dragging
                  ? "border-gold bg-gold-soft scale-[1.01]"
                  : "border-border hover:border-border-strong hover:bg-accent"
              }`}
            >
              <Upload className={`h-8 w-8 mx-auto mb-2 ${dragging ? "text-gold" : "text-muted-foreground"}`} />
              <div className="text-sm font-medium">Drag & drop images here</div>
              <div className="text-xs text-muted-foreground mt-1">or click to browse files</div>
              <div className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP · Max 5MB · Auto-converted to WebP</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
              />
            </div>

            {/* Pending previews */}
            {pending.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {pending.length} image{pending.length > 1 ? "s" : ""} ready to upload
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {pending.map(({ preview }, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setPending((p) => p.filter((_, j) => j !== i)); }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive grid place-items-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload metadata */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Caption</label>
                <input
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="e.g. Fresh sourdough boule"
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {CATEGORIES.filter((c) => c.value).map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <button
                id="upload-gallery-btn"
                onClick={handleUploadAll}
                disabled={uploadImage.isPending || pending.length === 0}
                className="w-full h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {uploadImage.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                ) : (
                  <><Upload className="h-4 w-4" /> Upload {pending.length > 0 ? pending.length : ""} {pending.length === 1 ? "Image" : "Images"}</>
                )}
              </button>
            </div>
          </SectionCard>

          {/* Gallery Grid */}
          <div className="xl:col-span-2">
            <SectionCard>
              {/* Filter */}
              <div className="flex items-center gap-2 -mt-1 mb-5 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategoryFilter(c.value)}
                    className={`h-7 px-3 rounded-full text-xs font-medium transition-colors ${
                      categoryFilter === c.value
                        ? "bg-gold text-gold-foreground"
                        : "bg-surface border border-border hover:bg-accent"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse bg-border rounded-xl" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="py-16 text-center">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {categoryFilter ? "No images in this category" : "No images yet — upload some above"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img: any) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-border cursor-pointer"
                      onClick={() => setLightbox(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={img.caption ?? "Gallery image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                        {img.caption && (
                          <span className="text-white text-xs text-center line-clamp-2">{img.caption}</span>
                        )}
                        {img.category && (
                          <span className="text-[10px] uppercase tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
                            {img.category}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage.mutateAsync(img.id);
                          }}
                          className="mt-1 h-8 w-8 rounded-full bg-destructive grid place-items-center hover:opacity-90"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 grid place-items-center hover:bg-white/20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <img
            src={lightbox}
            alt="Gallery"
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
