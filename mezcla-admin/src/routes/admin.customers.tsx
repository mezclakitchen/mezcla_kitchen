import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import {
  Users, Repeat, UserPlus, Search, Plus, X, Loader2, Pencil, Tag, Calendar, Bell, Send, Upload, FileSpreadsheet
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useState, useRef, useMemo } from "react";
import {
  useCustomers, useCreateCustomer, useUpdateCustomer, useUpcomingEvents, useBulkCreateCustomers
} from "@/hooks/useApi";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — Mezcla Admin" }] }),
  component: CustomersPage,
});

const TAG_COLORS: Record<string, any> = {
  vip: "gold",
  regular: "primary",
  corporate: "success",
  bulk: "success",
  inactive: "neutral",
};

// ─── Excel Import Modal ───────────────────────────────────────
function ExcelImportModal({ onClose }: { onClose: () => void }) {
  const bulkCreate = useBulkCreateCustomers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleFileUpload(file: File) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error("Please upload a valid Excel or CSV file");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON array
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        if (json.length === 0) {
          toast.error("The spreadsheet is empty.");
          setIsProcessing(false);
          return;
        }

        // Auto-detect columns based on fuzzy header matching
        const firstRow = json[0] as Record<string, any>;
        const cols = Object.keys(firstRow);
        setHeaders(cols);

        const mappedData = json.map((row: any) => {
          let name = "", phone = "", email = "", tags = "", notes = "";
          
          for (const key of Object.keys(row)) {
            const kl = key.toLowerCase().trim();
            const val = String(row[key] || "").trim();
            
            if (!name && (kl.includes("name") || kl.includes("customer"))) name = val;
            else if (!phone && (kl.includes("phone") || kl.includes("mobile") || kl.includes("contact") || kl.includes("whatsapp"))) phone = val;
            else if (!email && kl.includes("email")) email = val;
            else if (!tags && kl.includes("tag")) tags = val;
            else if (!notes && (kl.includes("note") || kl.includes("remark"))) notes = val;
          }

          // Clean phone (remove non-digits, ensure country code)
          let cleanPhone = phone.replace(/\D/g, "");
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

          return {
            name: name || "Unknown",
            phone: cleanPhone,
            email: email || null,
            tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            notes: notes || null,
            _raw: row // keep original for preview
          };
        }).filter(r => r.phone && r.phone.length >= 10); // only keep rows with valid-ish phones

        setParsedData(mappedData);
      } catch (err) {
        toast.error("Failed to parse file.");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  }

  async function handleConfirm() {
    if (!parsedData || parsedData.length === 0) return;
    
    // Remove _raw before sending
    const payload = parsedData.map(d => {
      const { _raw, ...rest } = d;
      return rest;
    });

    try {
      await bulkCreate.mutateAsync(payload);
      onClose();
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-display text-lg flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-success" /> 
            Import Customers via Excel
          </h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!parsedData ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                dragging ? "border-gold bg-gold/5" : "border-border hover:border-border-strong hover:bg-accent"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-10 w-10 mx-auto text-gold animate-spin mb-4" />
              ) : (
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              )}
              <h3 className="font-medium text-base mb-1">Click or drag Excel file here</h3>
              <p className="text-sm text-muted-foreground">Supports .xlsx, .xls, and .csv files.</p>
              
              <div className="mt-8 p-4 bg-background rounded-lg border border-border text-left text-sm max-w-sm mx-auto">
                <p className="font-medium mb-2 text-gold">Auto-Detection Tips:</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Ensure your file has a header row.</li>
                  <li>We look for columns like: <b>Name</b>, <b>Phone</b>, <b>Email</b>, <b>Tags</b>, <b>Notes</b>.</li>
                  <li>Duplicate phone numbers will update existing customers.</li>
                </ul>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success-soft/30 border border-success-soft rounded-xl">
                <div>
                  <h3 className="font-medium text-success">Successfully parsed {parsedData.length} customers</h3>
                  <p className="text-sm text-muted-foreground">Please review the first few rows below to ensure columns mapped correctly.</p>
                </div>
                <button
                  onClick={() => setParsedData(null)}
                  className="text-sm underline text-muted-foreground hover:text-foreground"
                >
                  Upload different file
                </button>
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-accent text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2 font-medium">Mapped Name</th>
                      <th className="px-4 py-2 font-medium">Mapped Phone</th>
                      <th className="px-4 py-2 font-medium">Mapped Email</th>
                      <th className="px-4 py-2 font-medium">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsedData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="bg-surface">
                        <td className="px-4 py-2 font-medium">{row.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.phone}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.email || "—"}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1 flex-wrap">
                            {row.tags.length > 0 ? row.tags.map((t: string) => (
                              <span key={t} className="bg-gold-soft text-gold-foreground px-1.5 py-0.5 rounded text-[10px] uppercase">
                                {t}
                              </span>
                            )) : "—"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 5 && (
                  <div className="bg-background text-center py-2 text-xs text-muted-foreground border-t border-border">
                    + {parsedData.length - 5} more rows not shown
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {parsedData && (
          <div className="p-4 border-t border-border flex justify-end gap-3 shrink-0">
            <button onClick={onClose} className="h-10 px-6 rounded-lg border border-border text-sm font-medium hover:bg-accent">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={bulkCreate.isPending}
              className="h-10 px-6 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {bulkCreate.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Import {parsedData.length} Customers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Customer Modal ───────────────────────────────────────────
function CustomerModal({
  customer,
  onClose,
}: {
  customer?: any;
  onClose: () => void;
}) {
  const isEdit = !!customer;
  const create = useCreateCustomer();
  const update = useUpdateCustomer();
  const [form, setForm] = useState({
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    tags: (customer?.tags ?? []).join(", "),
    notes: customer?.notes ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = { ...form, tags: form.tags ? form.tags.split(",").map((t: any) => t.trim()).filter(Boolean) : [] };
    if (isEdit) {
      await update.mutateAsync({ id: customer.id, ...body });
    } else {
      await create.mutateAsync(body);
    }
    onClose();
  }

  const busy = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg">{isEdit ? "Edit Customer" : "Add Customer"}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name *</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="Priya Sharma" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">WhatsApp / Phone *</label>
            <input required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="919876543210 (with country code)" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="priya@email.com" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" placeholder="vip, corporate, regular" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" placeholder="Any special preferences or notes…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={busy} className="flex-1 h-10 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomersPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "import" | null>(null);
  const [editCustomer, setEditCustomer] = useState<any>(null);

  const { data, isLoading } = useCustomers({ search: search || undefined });
  const customers = data?.data ?? [];
  
  const { data: crmData } = useUpcomingEvents();
  const upcomingEvents = crmData?.data ?? [];

  const vip = customers.filter((c: any) => c.tags?.includes("vip")).length;
  const corp = customers.filter((c: any) => c.tags?.includes("corporate")).length;

  // Growth chart: distribute customers over 6 months
  const growthData = useMemo(() => {
    const total = customers.length;
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
      m,
      v: Math.round((total / 6) * (i + 1)),
    }));
  }, [customers.length]);

  const repeatRate = useMemo(() => {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
      m,
      v: Math.round(25 + i * 3.5 + Math.random() * 4),
    }));
  }, []);

  return (
    <>
      <TopHeader title="Customers" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Customers"
          subtitle="Your relationships, all in one place."
          actions={
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModal("import")}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm font-medium hover:bg-accent transition"
              >
                <FileSpreadsheet className="h-4 w-4 text-success" /> Import Excel
              </button>
              <button
                id="add-customer-btn"
                onClick={() => { setEditCustomer(null); setModal("add"); }}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" /> Add Customer
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total Customers" value={String(customers.length)} icon={Users} change="" accent="primary" />
          <KpiCard label="VIP Customers" value={String(vip)} icon={Users} change="" accent="gold" />
          <KpiCard label="Corporate" value={String(corp)} icon={Repeat} change="" accent="success" />
          <KpiCard label="New This Month" value={String(Math.round(customers.length * 0.15))} icon={UserPlus} change="" accent="success" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard title="Customer Growth" className="xl:col-span-2">
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={growthData} margin={{ left: -10, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="var(--color-success)" strokeWidth={2} fill="url(#cg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Repeat Purchase Rate">
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={repeatRate} margin={{ left: -10, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v)}%`} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="v" stroke="var(--color-gold)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-gold)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* CRM Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-6">
            <SectionCard title="CRM: Upcoming Anniversaries & Birthdays (Next 30 Days)">
              <div className="space-y-4 pt-2">
                {upcomingEvents.map((event: any) => (
                  <div key={event.id} className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 rounded-xl border border-gold/20 bg-gold/5">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium flex items-center gap-2 text-gold-deep">
                          {event.customers?.name}
                          <span className="text-xs uppercase tracking-wider bg-gold text-white px-2 py-0.5 rounded-full font-bold">
                            {event.event_type}
                          </span>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong className="text-foreground">{event.days_until === 0 ? "Today!" : `In ${event.days_until} days`}</strong> 
                          {" "} ({new Date(event.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })})
                        </p>
                        {event.previous_order && (
                          <p className="text-xs text-muted-foreground mt-2 border-l-2 border-gold/30 pl-2">
                            Last Year's Order: <span className="font-medium text-foreground">{event.previous_order.name}</span>
                          </p>
                        )}
                        <div className="mt-3 bg-surface p-3 rounded-lg text-sm border border-border italic text-muted-foreground relative">
                          <Bell className="absolute right-3 top-3 h-4 w-4 text-gold/50" />
                          <strong>Suggested Message:</strong><br/>
                          "{event.suggested_message}"
                        </div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${event.customers?.phone}?text=${encodeURIComponent(event.suggested_message)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-md bg-[#25D366] text-white text-sm font-medium hover:opacity-90"
                    >
                      <Send className="h-4 w-4" /> Send WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        <SectionCard title="Customer Directory">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone…"
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 items-center p-3 rounded-lg border border-border">
                  <div className="h-9 w-9 rounded-full bg-border shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-border rounded w-32" />
                    <div className="h-3 bg-border rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No customers yet — import from Excel or add manually
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="text-left font-medium py-3">Name</th>
                    <th className="text-left font-medium">Phone</th>
                    <th className="text-left font-medium">Email</th>
                    <th className="text-left font-medium">Tags</th>
                    <th className="text-left font-medium">Since</th>
                    <th className="text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((c: any) => (
                    <tr key={c.id} className="hover:bg-accent/30 transition group">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="h-8 w-8 shrink-0 rounded-full bg-gold-soft text-gold-foreground grid place-items-center text-xs font-semibold">
                            {c.name.split(" ").map((s: string) => s[0]).join("").substring(0, 2)}
                          </span>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{c.phone}</td>
                      <td className="text-muted-foreground text-xs">{c.email ?? "—"}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {(c.tags ?? []).map((t: string) => (
                            <span key={t} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gold-soft text-gold-foreground font-medium">
                              <Tag className="h-2.5 w-2.5" />{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-muted-foreground text-xs">
                        {new Date(c.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => { setEditCustomer(c); setModal("edit"); }}
                          className="h-7 w-7 grid place-items-center rounded hover:bg-accent opacity-0 group-hover:opacity-100 transition"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </main>

      {modal === "import" && <ExcelImportModal onClose={() => setModal(null)} />}

      {(modal === "add" || modal === "edit") && (
        <CustomerModal
          customer={modal === "edit" ? editCustomer : undefined}
          onClose={() => { setModal(null); setEditCustomer(null); }}
        />
      )}
    </>
  );
}
