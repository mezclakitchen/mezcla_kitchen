import { createFileRoute, Link } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import { BookOpen, Plus, Pencil, Trash2, Loader2, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useMenus, useCreateMenu, useUpdateMenu, useDeleteMenu } from "@/hooks/useApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menus/")({
  head: () => ({ meta: [{ title: "Menus — Mezcla Admin" }] }),
  component: MenusPage,
});

function MenuModal({ menu, onClose }: { menu?: any; onClose: () => void }) {
  const isEdit = !!menu;
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();

  let parsedTagline = menu?.tagline ?? "";
  let parsedCoverText = "";
  let parsedBackText = "";
  let parsedQuote = "Good food is the foundation of genuine happiness.";
  let parsedQuoteAuthor = "— Auguste Escoffier";
  
  if (menu?.tagline?.startsWith("{")) {
    try {
      const data = JSON.parse(menu.tagline);
      parsedTagline = data.tagline ?? "";
      parsedCoverText = data.cover_text ?? "";
      parsedBackText = data.back_text ?? "";
      if (data.quote) parsedQuote = data.quote;
      if (data.quote_author) parsedQuoteAuthor = data.quote_author;
    } catch (e) {
      // fallback to raw string
    }
  }

  const [form, setForm] = useState({
    name: menu?.name ?? "",
    tagline: parsedTagline,
    cover_text: parsedCoverText,
    back_text: parsedBackText,
    quote: parsedQuote,
    quote_author: parsedQuoteAuthor,
    theme: menu?.theme ?? "classic",
    is_active: menu?.is_active ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tagline: JSON.stringify({
          tagline: form.tagline,
          cover_text: form.cover_text,
          back_text: form.back_text,
          quote: form.quote,
          quote_author: form.quote_author,
        })
      };
      
      if (isEdit) {
        await updateMenu.mutateAsync({ id: menu.id, ...payload });
      } else {
        await createMenu.mutateAsync(payload);
      }
      onClose();
    } catch {
      // errors handled by hooks
    }
  }

  const busy = createMenu.isPending || updateMenu.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{isEdit ? "Edit Menu Details" : "Create New Menu"}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Menu Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="e.g. Everyday Menu"
            />
            <p className="text-xs text-muted-foreground mt-1">This will appear on the PDF cover.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Theme *</label>
              <select
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="classic">Classic Cream</option>
                <option value="pearl">Pearl White</option>
                <option value="rose">Soft Rose</option>
                <option value="sage">Sage Linen</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Top Tagline (Optional)</label>
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="e.g. The Monsoon Collection"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Cover Quote</label>
              <input
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder='e.g. Good food is the foundation of happiness.'
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Quote Author</label>
              <input
                value={form.quote_author}
                onChange={(e) => setForm({ ...form, quote_author: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                placeholder="e.g. — Auguste Escoffier"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Cover Page Bottom Text</label>
            <textarea
              value={form.cover_text}
              onChange={(e) => setForm({ ...form, cover_text: e.target.value })}
              className="w-full h-16 p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
              placeholder="e.g. A curated selection of European indulgence."
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Back Page Custom Text</label>
            <textarea
              value={form.back_text}
              onChange={(e) => setForm({ ...form, back_text: e.target.value })}
              className="w-full h-24 p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
              placeholder="e.g. The Curator's Choice... For the ultimate Mezcla experience..."
            />
          </div>
          
          <label className="flex items-center gap-2.5 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
            />
            <span className="text-sm font-medium">Active (Visible internally)</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-lg border border-border bg-surface text-sm font-medium hover:bg-accent">
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !form.name}
              className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MenusPage() {
  const { data, isLoading } = useMenus();
  const deleteMenu = useDeleteMenu();
  const updateMenu = useUpdateMenu();
  
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editMenu, setEditMenu] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const menus = data?.data ?? [];

  async function handleToggleActive(menu: any) {
    await updateMenu.mutateAsync({ id: menu.id, is_active: !menu.is_active });
  }

  async function handleDelete(menu: any) {
    await deleteMenu.mutateAsync(menu.id);
    setDeleteConfirm(null);
  }

  return (
    <>
      <TopHeader title="Menus" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Menu Management"
          subtitle="Create and customize multiple PDF menus for everyday, specials, or events."
          actions={
            <button
              onClick={() => { setEditMenu(null); setModal("add"); }}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" /> Create Menu
            </button>
          }
        />

        <SectionCard>
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            </div>
          ) : menus.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No Menus Yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first menu to customize what products to display.</p>
              <button
                onClick={() => { setEditMenu(null); setModal("add"); }}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-gold text-gold text-sm font-medium hover:bg-gold/10"
              >
                <Plus className="h-4 w-4" /> Create First Menu
              </button>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-accent/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Menu Name</th>
                    <th className="px-4 py-3 font-medium">Theme</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Last Updated</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {menus.map((menu: any) => (
                    <tr key={menu.id} className="hover:bg-accent/30 transition">
                      <td className="px-4 py-3">
                        <a href={`/admin/menus/${menu.id}`} className="font-medium text-sm text-gold hover:underline">
                          {menu.name}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">
                        {menu.theme || "light"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill tone={menu.is_active ? "success" : "neutral"}>
                          {menu.is_active ? "Active" : "Inactive"}
                        </StatusPill>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(menu.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/admin/menus/${menu.id}`}
                            className="h-8 px-3 inline-flex items-center rounded-md border border-border text-xs font-medium hover:bg-accent"
                          >
                            Manage Items
                          </a>
                          <a
                            href={`/admin/menu?id=${menu.id}`}
                            target="_blank"
                            className="h-8 px-3 inline-flex items-center rounded-md bg-gold/10 text-gold border border-gold/30 text-xs font-medium hover:bg-gold/20"
                          >
                            View PDF
                          </a>
                          <button
                            title="Edit Details"
                            onClick={() => { setEditMenu(menu); setModal("edit"); }}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-accent"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteConfirm(menu)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </main>

      {/* Menu Modal */}
      {(modal === "add" || modal === "edit") && (
        <MenuModal
          menu={modal === "edit" ? editMenu : undefined}
          onClose={() => { setModal(null); setEditMenu(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface border border-border p-6 shadow-2xl">
            <h3 className="font-display text-lg mb-2">Delete Menu?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This will remove the menu and all its item configurations. Products will not be deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 rounded-lg border border-border bg-surface text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMenu.isPending}
                className="flex-1 h-10 rounded-lg bg-destructive text-destructive-foreground text-sm font-bold hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {deleteMenu.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
