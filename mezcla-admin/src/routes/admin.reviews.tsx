import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import { Star, Plus, Pencil, Trash2, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import {
  useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
} from "@/hooks/useApi";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Mezcla Admin" }] }),
  component: ReviewsPage,
});

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          className={`transition-colors ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`h-5 w-5 ${i < rating ? "fill-gold text-gold" : "text-border"}`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({
  review,
  onClose,
}: {
  review?: any;
  onClose: () => void;
}) {
  const isEdit = !!review;
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const [form, setForm] = useState({
    name: review?.name ?? "",
    location: review?.location ?? "",
    rating: review?.rating ?? 5,
    text: review?.text ?? "",
    is_active: review?.is_active ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit) {
      await update.mutateAsync({ id: review.id, ...form });
    } else {
      await create.mutateAsync(form);
    }
    onClose();
  }

  const busy = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{isEdit ? "Edit Review" : "Add Review"}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Customer Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Priya Sharma"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="Indiranagar, Bangalore"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Rating *</label>
            <StarRating rating={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Review Text *</label>
            <textarea
              required
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
              placeholder="What did the customer say?"
            />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm font-medium">Show on website</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent">
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewsPage() {
  const { data, isLoading } = useTestimonials();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editReview, setEditReview] = useState<any>(null);

  const reviews = data?.data ?? [];
  const active = reviews.filter((r: any) => r.is_active).length;
  const avg = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <>
      <TopHeader title="Reviews" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Customer Reviews"
          subtitle="Manage testimonials shown on your website."
          actions={
            <button
              id="add-review-btn"
              onClick={() => { setEditReview(null); setModal("add"); }}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add Review
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-elevated p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Reviews</div>
            <div className="font-display text-3xl mt-1">{reviews.length}</div>
          </div>
          <div className="card-elevated p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Showing on Site</div>
            <div className="font-display text-3xl mt-1 text-success">{active}</div>
          </div>
          <div className="card-elevated p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Average Rating</div>
            <div className="font-display text-3xl mt-1 text-gold flex items-center gap-1">
              <Star className="h-6 w-6 fill-gold" /> {avg}
            </div>
          </div>
        </div>

        <SectionCard>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse p-4 rounded-lg border border-border space-y-2">
                  <div className="h-4 w-40 bg-border rounded" />
                  <div className="h-16 bg-border rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No reviews yet. Add your first customer testimonial.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r: any) => (
                <div key={r.id} className="p-4 rounded-xl border border-border bg-background hover:border-border-strong transition group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-gold-soft text-gold-foreground grid place-items-center font-semibold text-sm shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{r.name}</div>
                          {r.location && <div className="text-xs text-muted-foreground">{r.location}</div>}
                        </div>
                        <StarRating rating={r.rating} />
                        <StatusPill tone={r.is_active ? "success" : "primary"}>
                          {r.is_active ? "Visible" : "Hidden"}
                        </StatusPill>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Added {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button
                        onClick={() => update.mutateAsync({ id: r.id, is_active: !r.is_active })}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"
                        title={r.is_active ? "Hide" : "Show"}
                      >
                        {r.is_active ? (
                          <ToggleRight className="h-4 w-4 text-success" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => { setEditReview(r); setModal("edit"); }}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => remove.mutateAsync(r.id)}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </main>

      {(modal === "add" || modal === "edit") && (
        <ReviewModal
          review={modal === "edit" ? editReview : undefined}
          onClose={() => { setModal(null); setEditReview(null); }}
        />
      )}
    </>
  );
}
