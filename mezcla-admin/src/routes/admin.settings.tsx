import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard } from "@/components/admin/ui";
import {
  Building2, Receipt, MessageCircle, Share2, Globe, Home, Megaphone,
  AlertTriangle, Loader2, Plus, Trash2, Check, Phone, Mail, MapPin,
  Clock, Instagram, Facebook, Info, Link, Pencil, X, Save, Gift,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  useContactSettings, useSaveContactSettings, useHomepageSettings, useSaveHomepageSettings,
  useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement,
  useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq,
} from "@/hooks/useApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Mezcla Admin" }] }),
  component: SettingsPage,
});

const sections = [
  { id: "business", icon: Building2, label: "Business Info" },
  { id: "gst", icon: Receipt, label: "GST & Billing" },
  { id: "social", icon: Share2, label: "Social Links" },
  { id: "seo", icon: Globe, label: "SEO" },
  { id: "home", icon: Home, label: "Homepage" },
  { id: "navigation", icon: Link, label: "Navigation" },
  { id: "announcements", icon: Megaphone, label: "Announcements" },
  { id: "faqs", icon: Info, label: "FAQs" },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
  { id: "danger", icon: AlertTriangle, label: "Danger Zone" },
];

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

// ─── Announcement Edit Modal ───────────────────────────────────
function AnnouncementEditModal({
  announcement,
  onClose,
}: { announcement: any; onClose: () => void }) {
  const updateAnn = useUpdateAnnouncement();
  const [text, setText] = useState(announcement.text);

  async function handleSave() {
    if (!text.trim()) { toast.error("Announcement text is required"); return; }
    if (text.length > 500) { toast.error("Announcement must be under 500 characters"); return; }
    await updateAnn.mutateAsync({ id: announcement.id, text: text.trim() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">Edit Announcement</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Announcement Text <span className="normal-case text-muted-foreground">({text.length}/500)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="e.g. Christmas Orders Open · Booking slots available!"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateAnn.isPending}
              className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {updateAnn.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Edit Modal ─────────────────────────────────────────────
const FAQ_CATEGORIES = ["general", "ordering", "grazing", "hampers", "breads", "dips", "snack-boxes"];

function FaqEditModal({
  faq,
  onClose,
}: { faq?: any; onClose: () => void }) {
  const isEdit = !!faq;
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const [form, setForm] = useState({
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    category: faq?.category ?? "general",
    is_active: faq?.is_active ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim()) { toast.error("Question is required"); return; }
    if (!form.answer.trim()) { toast.error("Answer is required"); return; }
    if (form.question.length > 500) { toast.error("Question must be under 500 characters"); return; }
    if (form.answer.length > 5000) { toast.error("Answer must be under 5000 characters"); return; }
    if (isEdit) {
      await updateFaq.mutateAsync({ id: faq.id, ...form });
    } else {
      await createFaq.mutateAsync(form);
    }
    onClose();
  }

  const busy = createFaq.isPending || updateFaq.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{isEdit ? "Edit FAQ" : "Add FAQ"}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Question * <span className="normal-case">({form.question.length}/500)</span>
            </label>
            <input
              required
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              maxLength={500}
              placeholder="e.g. How far in advance should I order?"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Answer * <span className="normal-case">({form.answer.length}/5000)</span>
            </label>
            <textarea
              required
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              rows={5}
              maxLength={5000}
              placeholder="Detailed answer here…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2.5 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm font-medium">Show on website</span>
              </label>
            </div>
          </div>
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
              {isEdit ? "Save Changes" : "Add FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
function SettingsPage() {
  const { data: contactData, isLoading: contactLoading } = useContactSettings();
  const saveContact = useSaveContactSettings();

  const { data: homepageData, isLoading: homepageLoading } = useHomepageSettings();
  const saveHomepage = useSaveHomepageSettings();

  const { data: announcementsData } = useAnnouncements();
  const createAnn = useCreateAnnouncement();
  const updateAnn = useUpdateAnnouncement();
  const deleteAnn = useDeleteAnnouncement();

  const { data: faqsData } = useFaqs();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const [contact, setContact] = useState<Record<string, string>>({});
  const [homepage, setHomepage] = useState<Record<string, string>>({});
  const [newAnn, setNewAnn] = useState("");
  const [navLinks, setNavLinks] = useState<{ label: string; to: string }[]>([
    { to: "/", label: "Home" },
    { to: "/products", label: "Menu" },
    { to: "/grazing-tables", label: "Grazing Tables" },
    { to: "/hampers", label: "Hampers" },
    { to: "/festive", label: "Festive" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]);

  // Modal state
  const [annModal, setAnnModal] = useState<any>(null);
  const [faqModal, setFaqModal] = useState<{ mode: "add" | "edit"; faq?: any } | null>(null);

  const [activeSection, setActiveSection] = useState("business");

  useEffect(() => {
    if (contactData?.data) setContact(contactData.data);
  }, [contactData]);

  useEffect(() => {
    if (homepageData?.data) {
      setHomepage(homepageData.data);
      if (homepageData.data.navigation_links) {
        try {
          setNavLinks(JSON.parse(homepageData.data.navigation_links));
        } catch (e) {}
      }
    }
  }, [homepageData]);

  // Scroll Spy for Settings Navigation
  useEffect(() => {
    const checkActive = () => {
      let current = sections[0].id;
      
      // Find which section is currently at the top of the viewport
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // 300px offset accounts for TopHeader and padding
          if (rect.top <= 300) {
            current = s.id;
          }
        }
      }

      // If user scrolled to the absolute bottom of the page, force the last section to be active
      // (This fixes the bug where short sections at the bottom never reach the top of the screen)
      const main = document.querySelector('main');
      const scrollContainer = main?.parentElement;
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          current = sections[sections.length - 1].id;
        }
      }

      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    // Use a fast interval instead of attaching scroll listeners to unknown parent containers
    const interval = setInterval(checkActive, 100);
    return () => clearInterval(interval);
  }, [contactData, homepageData]);

  const announcements = announcementsData?.data ?? [];
  const faqs = faqsData?.data ?? [];

  async function handleSaveContact() {
    const entries = Object.entries(contact).map(([key, value]) => ({ key, value }));
    await saveContact.mutateAsync(entries);
  }

  async function handleSaveHomepage() {
    const entries = Object.entries(homepage).map(([key, value]) => ({ key, value, type: "text" }));
    await saveHomepage.mutateAsync(entries);
  }

  async function handleSaveNavigation() {
    const entries = [{ key: "navigation_links", value: JSON.stringify(navLinks), type: "json" }];
    await saveHomepage.mutateAsync(entries);
  }

  async function handleAddAnn() {
    if (!newAnn.trim()) return;
    if (newAnn.length > 500) { toast.error("Announcement must be under 500 characters"); return; }
    await createAnn.mutateAsync({ text: newAnn.trim(), is_active: true });
    setNewAnn("");
  }

  const setC = (key: string) => (v: string) => setContact((prev) => ({ ...prev, [key]: v }));
  const setH = (key: string) => (v: string) => setHomepage((prev) => ({ ...prev, [key]: v }));

  return (
    <>
      <TopHeader title="Settings" />
      <main className="flex-1 px-6 py-7">
        <PageHeader title="Settings" subtitle="Configure your business, integrations and content." />

        <div className="grid grid-cols-12 gap-6 relative">
          <nav className="col-span-12 lg:col-span-3 space-y-0.5 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-10">
            {sections.map((s) => {
              const Icon = s.icon;
              const danger = s.id === "danger";
              const isActive = activeSection === s.id;
              
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all ${
                    isActive
                      ? "bg-foreground text-background font-medium shadow-sm"
                      : danger
                        ? "text-destructive hover:bg-destructive-soft"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-gold" : ""}`} /> {s.label}
                </a>
              );
            })}
          </nav>

          <div className="col-span-12 lg:col-span-9 space-y-6">

            {/* ── Business Info ── */}
            <SectionCard
              title="Business Information"
              action={
                <button
                  onClick={handleSaveContact}
                  disabled={saveContact.isPending || contactLoading}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {saveContact.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Save
                </button>
              }
            >
              <div id="business" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone Number" value={contact.phone ?? ""} icon={Phone} onChange={setC("phone")} placeholder="+91 9999999999" />
                <Field label="WhatsApp Number (E.164)" value={contact.whatsapp ?? ""} icon={MessageCircle} onChange={setC("whatsapp")} placeholder="919999999999" help="Without + or spaces, e.g. 919876543210" />
                <Field label="Email Address" value={contact.email ?? ""} type="email" icon={Mail} onChange={setC("email")} placeholder="hello@mezclakitchen.in" />
                <Field label="Business Hours" value={contact.hours ?? ""} icon={Clock} onChange={setC("hours")} placeholder="Mon–Sat · 10 AM – 7 PM" />
                <div className="sm:col-span-2">
                  <Field label="Business Address" value={contact.address ?? ""} icon={MapPin} onChange={setC("address")} placeholder="Studio kitchen, Bangalore, Karnataka" />
                </div>
                <Field label="Service Area" value={contact.service_area ?? ""} onChange={setC("service_area")} placeholder="South & Central Bangalore" />
                <Field label="Delivery Note" value={contact.delivery_note ?? ""} onChange={setC("delivery_note")} placeholder="2–3 days advance notice required" />
              </div>
            </SectionCard>

            {/* ── GST & Billing ── */}
            <SectionCard
              title="GST & Invoice Settings"
              action={
                <button
                  onClick={handleSaveContact}
                  disabled={saveContact.isPending}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {saveContact.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Save
                </button>
              }
            >
              <div id="gst" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="GSTIN" value={contact.gstin ?? ""} onChange={setC("gstin")} help="Your GST Identification Number" placeholder="29AAAAA0000A1Z5" />
                <Field label="FSSAI License Number" value={contact.fssai ?? ""} onChange={setC("fssai")} placeholder="FSSAI License: XXXXXXXXXXXX" />
                <div>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">CGST %</span>
                    <div className="relative mt-1.5">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={contact.cgst_pct ?? "2.5"}
                        onChange={(e) => setC("cgst_pct")(e.target.value)}
                        className="w-full h-10 pl-3 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                      />
                    </div>
                    <span className="block text-xs text-muted-foreground mt-1">Central GST percentage applied to all orders</span>
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">SGST %</span>
                    <div className="relative mt-1.5">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={contact.sgst_pct ?? "2.5"}
                        onChange={(e) => setC("sgst_pct")(e.target.value)}
                        className="w-full h-10 pl-3 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                      />
                    </div>
                    <span className="block text-xs text-muted-foreground mt-1">State GST percentage applied to all orders</span>
                  </label>
                </div>
                <div>
                  <Field label="Google Review Link" value={contact.google_review_link ?? ""} onChange={setC("google_review_link")} placeholder="https://g.page/r/XXXX/review" help="Share this link with customers to collect Google reviews" />
                </div>
                <div>
                  <Field label="Invoice Prefix" value={contact.invoice_prefix ?? "MZ"} onChange={setC("invoice_prefix")} placeholder="MZ" help="Used in invoice numbers: MZ-2026-001" />
                </div>
              </div>
            </SectionCard>

            {/* ── Social Links ── */}
            <SectionCard
              title="Social Links"
              action={
                <button
                  onClick={handleSaveContact}
                  disabled={saveContact.isPending}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {saveContact.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Save
                </button>
              }
            >
              <div id="social" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Instagram URL" value={contact.instagram ?? ""} icon={Instagram} onChange={setC("instagram")} placeholder="https://instagram.com/mezclakitchen" />
                <Field label="Facebook URL" value={contact.facebook ?? ""} icon={Facebook} onChange={setC("facebook")} placeholder="https://facebook.com/mezclakitchen" />
              </div>
            </SectionCard>

            {/* ── SEO ── */}
            <SectionCard
              title="SEO & Meta Content"
              action={
                <button
                  onClick={handleSaveHomepage}
                  disabled={saveHomepage.isPending || homepageLoading}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                >
                  {saveHomepage.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Save
                </button>
              }
            >
              <div id="seo" className="space-y-4">
                <div className="p-3 rounded-lg bg-gold-soft border border-gold/20 text-xs text-muted-foreground">
                  💡 These fields control how your site appears in Google search results and social media previews.
                </div>
                <Field label="Site Meta Title" value={homepage.meta_title ?? ""} onChange={setH("meta_title")} placeholder="Mezcla — Artisan Sourdough, Hampers & Grazing Tables in Bangalore" help="Keep under 60 characters for best Google display" />
                <Field label="Site Meta Description" value={homepage.meta_description ?? ""} onChange={setH("meta_description")} placeholder="Mezcla is a Bangalore home kitchen crafting sourdough breads, mezze, hampers and grazing tables." help="Keep under 160 characters" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Hero Headline" value={homepage.hero_title ?? ""} onChange={setH("hero_title")} placeholder="Honest food," />
                  <Field label="Hero Subtitle (italic)" value={homepage.hero_subtitle ?? ""} onChange={setH("hero_subtitle")} placeholder="made the slow way." />
                </div>
                <Field label="Hero WhatsApp CTA Text" value={homepage.whatsapp_cta_text ?? ""} onChange={setH("whatsapp_cta_text")} placeholder="Enquire on WhatsApp" />
                <Field label="Featured Section Title" value={homepage.featured_section_title ?? ""} onChange={setH("featured_section_title")} />
              </div>
            </SectionCard>

            {/* ── Homepage Content ── */}
            <SectionCard
              title="Homepage Banner & CTAs"
              action={
                <button onClick={handleSaveHomepage} disabled={saveHomepage.isPending} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60">
                  {saveHomepage.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Save
                </button>
              }
            >
              <div id="home" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 mb-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Hero Banner Image URL</label>
                  <div className="flex gap-2">
                    <input
                      value={homepage.hero_image ?? ""}
                      onChange={(e) => setH("hero_image")(e.target.value)}
                      placeholder="https://... or upload to Gallery first, then paste URL here"
                      className="flex-1 h-10 px-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  {homepage.hero_image && (
                    <img src={homepage.hero_image} alt="Hero preview" className="mt-2 h-20 w-32 object-cover rounded-md border border-border" />
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Upload images via Gallery → copy the Supabase URL → paste here.
                  </p>
                </div>
                <Field label="Hero CTA Primary" value={homepage.hero_cta_primary ?? ""} onChange={setH("hero_cta_primary")} placeholder="See Menu on WhatsApp" />
                <Field label="Hero CTA Secondary" value={homepage.hero_cta_secondary ?? ""} onChange={setH("hero_cta_secondary")} placeholder="Plan a Grazing Table" />
                <Field label="Instagram Handle" value={homepage.instagram_handle ?? ""} onChange={setH("instagram_handle")} placeholder="@mezclakitchen" />
              </div>
            </SectionCard>

            {/* ── Navigation ── */}
            <SectionCard
              title="Navigation Links"
              action={
                <button onClick={handleSaveNavigation} disabled={saveHomepage.isPending} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60">
                  {saveHomepage.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Save
                </button>
              }
            >
              <div id="navigation" className="space-y-3">
                <p className="text-xs text-muted-foreground">Drag to reorder (coming soon). Changes apply immediately on save.</p>
                {navLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input value={link.label} onChange={(e) => {
                      const n = [...navLinks]; n[idx].label = e.target.value; setNavLinks(n);
                    }} placeholder="Label (e.g. Menu)" className="w-1/2 h-10 px-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
                    <input value={link.to} onChange={(e) => {
                      const n = [...navLinks]; n[idx].to = e.target.value; setNavLinks(n);
                    }} placeholder="Path (e.g. /products)" className="w-1/2 h-10 px-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
                    <button onClick={() => setNavLinks(navLinks.filter((_, i) => i !== idx))} className="h-10 w-10 grid place-items-center shrink-0 border border-border rounded-md hover:bg-accent text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setNavLinks([...navLinks, { label: "New Link", to: "/" }])} className="inline-flex items-center gap-1.5 h-9 px-4 mt-2 rounded-md border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add Link
                </button>
              </div>
            </SectionCard>

            {/* ── Announcements ── */}
            <SectionCard title="Offer Ticker & Announcements">
              <div id="announcements" className="space-y-3">
                <p className="text-xs text-muted-foreground">These scroll across the top banner on your website. Keep each one concise (under 120 chars for readability).</p>

                {announcements.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    No announcements yet. Add one below.
                  </div>
                )}

                {announcements.map((a: any) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background group">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${a.is_active ? "bg-success-soft text-success" : "bg-border text-muted-foreground"}`}>
                          {a.is_active ? "● Active" : "○ Hidden"}
                        </span>
                        <span className="text-xs text-muted-foreground">{a.text.length} chars</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {/* Edit */}
                      <button
                        onClick={() => setAnnModal(a)}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      {/* Show/Hide */}
                      <button
                        onClick={() => updateAnn.mutate({ id: a.id, is_active: !a.is_active })}
                        disabled={updateAnn.isPending && updateAnn.variables?.id === a.id}
                        className="h-8 px-2 rounded-md text-xs border border-border hover:bg-accent disabled:opacity-60 flex items-center gap-1"
                      >
                        {updateAnn.isPending && updateAnn.variables?.id === a.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          a.is_active ? "Hide" : "Show"
                        )}
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => { if (confirm("Delete this announcement?")) deleteAnn.mutate(a.id); }}
                        disabled={deleteAnn.isPending && deleteAnn.variables === a.id}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent disabled:opacity-60"
                        title="Delete"
                      >
                        {deleteAnn.isPending && deleteAnn.variables === a.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new */}
                <div className="flex gap-2 mt-3">
                  <input
                    value={newAnn}
                    onChange={(e) => setNewAnn(e.target.value)}
                    placeholder="e.g. Christmas Orders Open · Limited slots available!"
                    onKeyDown={(e) => e.key === "Enter" && handleAddAnn()}
                    maxLength={500}
                    className="flex-1 h-10 px-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                  <button
                    onClick={handleAddAnn}
                    disabled={createAnn.isPending || !newAnn.trim()}
                    className="h-10 px-4 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {createAnn.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Add
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* ── FAQs ── */}
            <SectionCard
              title="FAQ Management"
              action={
                <button
                  onClick={() => setFaqModal({ mode: "add" })}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90"
                >
                  <Plus className="h-3 w-3" /> Add FAQ
                </button>
              }
            >
              <div id="faqs" className="space-y-3">
                <p className="text-xs text-muted-foreground">FAQs appear on your website homepage and product pages. They also help with Google SEO rankings.</p>

                {faqs.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    No FAQs yet. Click "Add FAQ" to create your first one.
                  </div>
                )}

                {faqs.map((faq: any) => (
                  <div key={faq.id} className="p-4 rounded-lg border border-border bg-background group hover:border-border-strong transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{faq.question}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{faq.answer}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {faq.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${faq.is_active ? "bg-success-soft text-success" : "bg-border text-muted-foreground"}`}>
                            {faq.is_active ? "● Active" : "○ Hidden"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit */}
                        <button
                          onClick={() => setFaqModal({ mode: "edit", faq })}
                          className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent"
                          title="Edit FAQ"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        {/* Show/Hide */}
                        <button
                          onClick={() => updateFaq.mutate({ id: faq.id, is_active: !faq.is_active })}
                          disabled={updateFaq.isPending && updateFaq.variables?.id === faq.id}
                          className="h-8 px-2 rounded-md text-xs border border-border hover:bg-accent disabled:opacity-60 flex items-center gap-1"
                        >
                          {updateFaq.isPending && updateFaq.variables?.id === faq.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            faq.is_active ? "Hide" : "Show"
                          )}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => { if (confirm("Delete this FAQ? This cannot be undone.")) deleteFaq.mutate(faq.id); }}
                          disabled={deleteFaq.isPending && deleteFaq.variables === faq.id}
                          className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent disabled:opacity-60"
                          title="Delete FAQ"
                        >
                          {deleteFaq.isPending && deleteFaq.variables === faq.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── WhatsApp ── */}
            <SectionCard title="WhatsApp Integration">
              <div id="whatsapp" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your primary WhatsApp number is configured in the <strong>Business Info</strong> section.
                </p>
                <div className="p-5 rounded-lg border border-border bg-accent/30 flex flex-col items-center justify-center text-center gap-3 mt-4">
                  <div className="h-12 w-12 rounded-full bg-[#25D366]/10 text-[#25D366] grid place-items-center">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-base">WhatsApp Broadcasts & Promotions</div>
                    <div className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      Manage your customer lists and send bulk updates, festive hampers catalogs, and customized offers directly via WhatsApp.
                    </div>
                  </div>
                  <a href="/admin/promotions" className="mt-2 h-9 px-4 rounded-md bg-[#25D366] text-white text-sm font-medium hover:opacity-90 inline-flex items-center justify-center">
                    Open Promotions Dashboard
                  </a>
                </div>
              </div>
            </SectionCard>

            {/* ── Danger Zone ── */}
            <div id="danger" className="card-elevated border-destructive/40">
              <div className="px-5 py-4 border-b border-destructive/30">
                <h3 className="font-display text-lg text-destructive">Danger Zone</h3>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-4 p-4 rounded-md border border-destructive/30 bg-destructive-soft">
                  <div>
                    <div className="font-medium text-sm">Export & delete all data</div>
                    <div className="text-xs text-muted-foreground">Permanent. You'll receive an export before deletion.</div>
                  </div>
                  <button className="h-9 px-3 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Announcement Edit Modal */}
      {annModal && (
        <AnnouncementEditModal
          announcement={annModal}
          onClose={() => setAnnModal(null)}
        />
      )}

      {/* FAQ Add/Edit Modal */}
      {faqModal && (
        <FaqEditModal
          faq={faqModal.mode === "edit" ? faqModal.faq : undefined}
          onClose={() => setFaqModal(null)}
        />
      )}
    </>
  );
}
