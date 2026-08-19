import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import {
  FileText, IndianRupee, Clock, CheckCircle2, Plus, Trash2, Loader2,
  Send, Download, Search, Filter, ChevronDown, ChevronUp, X, Receipt,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useOrders, useCreateOrder, useGenerateInvoice, useSendInvoice,
  useUpdateOrderStatus, useDeleteOrder, useProducts,
} from "@/hooks/useApi";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/admin/billing")({
  head: () => ({ meta: [{ title: "Billing & Invoices — Mezcla Admin" }] }),
  component: BillingPage,
});

function fmt(n: number) { return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }

const statusTone = (s: string): any => ({ paid: "success", pending: "warning", partially_paid: "gold", cancelled: "destructive" }[s] ?? "primary");

// ─── New Order Form ────────────────────────────────────────────
interface LineItem { name: string; qty: number; price: number; total: number; }

function NewOrderForm({
  products,
  onSuccess,
  onClose,
}: {
  products: any[];
  onSuccess: () => void;
  onClose: () => void;
}) {
  const createOrder = useCreateOrder();
  const [form, setForm] = useState({
    customer_name: "", customer_phone: "", customer_email: "", customer_address: "",
    cgst_pct: 2.5, sgst_pct: 2.5, discount: 0, delivery_charge: 0,
    payment_method: "upi", notes: "",
  });
  const [items, setItems] = useState<LineItem[]>([{ name: "", qty: 1, price: 0, total: 0 }]);

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const taxable = subtotal - Number(form.discount) + Number(form.delivery_charge);
  const cgstAmt = parseFloat(((taxable * form.cgst_pct) / 100).toFixed(2));
  const sgstAmt = parseFloat(((taxable * form.sgst_pct) / 100).toFixed(2));
  const total = parseFloat((taxable + cgstAmt + sgstAmt).toFixed(2));

  function setItem(i: number, key: string, val: any) {
    setItems((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [key]: val };
      if (key === "qty" || key === "price") {
        updated[i].total = parseFloat((updated[i].qty * updated[i].price).toFixed(2));
      }
      if (key === "name") {
        // Auto-fill price from product catalogue
        const found = products.find((p) => p.name === val);
        if (found?.price) {
          updated[i].price = Number(found.price);
          updated[i].total = parseFloat((updated[i].qty * Number(found.price)).toFixed(2));
        }
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.some((i) => !i.name || i.total <= 0)) {
      toast.error("All line items must have a name and price");
      return;
    }
    await createOrder.mutateAsync({ ...form, items });
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg">New Order & Invoice</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-gold text-gold-foreground text-xs grid place-items-center">1</span>
              Customer Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                <input required value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="Priya Sharma" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">WhatsApp / Phone *</label>
                <input required value={form.customer_phone} onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="919876543210" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                <input required type="email" value={form.customer_email} onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="priya@email.com" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Payment Method</label>
                <select value={form.payment_method} onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
                  {["upi", "cash", "bank_transfer", "card", "other"].map((m) => (
                    <option key={m} value={m}>{m.replace("_", " ").toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Delivery Address</label>
                <input value={form.customer_address} onChange={(e) => setForm((f) => ({ ...f, customer_address: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="Delivery address in Bangalore" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-gold text-gold-foreground text-xs grid place-items-center">2</span>
              Order Items
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wider text-muted-foreground px-1">
                <div className="col-span-5">Item Name</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Price (₹)</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1" />
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 flex flex-col gap-1 relative">
                    {!products.some((p) => p.name === item.name) && item.name !== "" ? (
                      <div className="flex items-center gap-1">
                        <input
                          value={item.name}
                          onChange={(e) => setItem(idx, "name", e.target.value)}
                          className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                          placeholder="Enter custom item name..."
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setItem(idx, "name", "")}
                          className="h-9 w-9 flex-shrink-0 grid place-items-center rounded-md border border-border bg-accent/50 hover:bg-accent text-muted-foreground"
                          title="Back to menu items"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <select
                        value={item.name === "" ? "" : item.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "custom") {
                            setItem(idx, "name", " "); // Space triggers custom input
                            setItem(idx, "price", 0);
                          } else {
                            setItem(idx, "name", val);
                          }
                        }}
                        className="w-full h-9 px-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="" disabled>Select product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                        <option value="disabled-divider" disabled>──────────</option>
                        <option value="custom">+ Custom Item</option>
                      </select>
                    )}
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => setItem(idx, "qty", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm text-right focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.price}
                      onChange={(e) => setItem(idx, "price", Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm text-right focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div className="col-span-2 text-right font-mono text-sm font-medium">
                    ₹{item.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setItems((prev) => [...prev, { name: "", qty: 1, price: 0, total: 0 }])}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:bg-accent hover:text-foreground mt-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-gold text-gold-foreground text-xs grid place-items-center">3</span>
              Pricing & GST
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Discount (₹)</label>
                <input type="number" min={0} step={0.01} value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Delivery Charge (₹)</label>
                <input type="number" min={0} step={0.01} value={form.delivery_charge} onChange={(e) => setForm((f) => ({ ...f, delivery_charge: Number(e.target.value) }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">CGST %</label>
                <input type="number" min={0} max={14} step={0.5} value={form.cgst_pct} onChange={(e) => setForm((f) => ({ ...f, cgst_pct: Number(e.target.value) }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">SGST %</label>
                <input type="number" min={0} max={14} step={0.5} value={form.sgst_pct} onChange={(e) => setForm((f) => ({ ...f, sgst_pct: Number(e.target.value) }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Notes (printed on invoice)</label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  placeholder="Any special notes for the customer" />
              </div>
            </div>
          </div>

          {/* Invoice Preview / Totals */}
          <div className="rounded-xl bg-background border border-border p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Invoice Summary</div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{fmt(subtotal)}</span></div>
              {Number(form.discount) > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="font-mono">-{fmt(Number(form.discount))}</span></div>}
              {Number(form.delivery_charge) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-mono">{fmt(Number(form.delivery_charge))}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">CGST ({form.cgst_pct}%)</span><span className="font-mono">{fmt(cgstAmt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">SGST ({form.sgst_pct}%)</span><span className="font-mono">{fmt(sgstAmt)}</span></div>
              <div className="flex justify-between font-display text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-gold">{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border text-sm font-medium hover:bg-accent">Cancel</button>
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="flex-1 h-11 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {createOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Create Order & Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Billing Page ─────────────────────────────────────────────
function BillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data, isLoading } = useOrders({ search: search || undefined, status: statusFilter || undefined, limit: 100 } as any);
  const { data: productsData } = useProducts({ limit: 100 } as any);
  const generateInvoice = useGenerateInvoice();
  const sendInvoice = useSendInvoice();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  let orders = data?.data ?? [];

  // Client-side date filter
  if (dateFilter !== "all") {
    const now = new Date();
    const filterDate = new Date();
    if (dateFilter === "7days") filterDate.setDate(now.getDate() - 7);
    if (dateFilter === "30days") filterDate.setDate(now.getDate() - 30);
    if (dateFilter === "this_month") filterDate.setDate(1);

    orders = orders.filter((o: any) => new Date(o.created_at) >= filterDate);
  }
  const products = productsData?.data ?? [];

  const totalRevenue = orders.filter((o: any) => o.status === "paid").reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
  const pendingRevenue = orders.filter((o: any) => o.status === "pending").reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
  const partialRevenue = orders.filter((o: any) => o.status === "partially_paid").reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);

  // Monthly revenue chart
  const revenueChart = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) {
      if (o.status !== "paid") continue;
      const m = new Date(o.created_at).toLocaleDateString("en-IN", { month: "short" });
      map[m] = (map[m] ?? 0) + Number(o.total ?? 0);
    }
    return Object.entries(map).map(([m, v]) => ({ m, v }));
  }, [orders]);

  return (
    <>
      <TopHeader title="Billing" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Billing & Invoices"
          subtitle="Create orders, generate branded PDF invoices, and track payments."
          actions={
            <button
              id="new-order-btn"
              onClick={() => setShowNewOrder(true)}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> New Order
            </button>
          }
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Paid Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} icon={IndianRupee} change="" accent="success" />
          <KpiCard label="Pending Revenue" value={`₹${(pendingRevenue / 1000).toFixed(1)}K`} icon={Clock} change="" accent="warning" />
          <KpiCard label="Partial Payments" value={`₹${(partialRevenue / 1000).toFixed(1)}K`} icon={CheckCircle2} change="" accent="gold" />
          <KpiCard label="Total Invoices" value={String(orders.length)} icon={FileText} change="" accent="primary" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          {/* Revenue Chart */}
          <SectionCard title="Monthly Revenue (Paid)" className="xl:col-span-2">
            <div className="h-52">
              {revenueChart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No paid orders yet</div>
              ) : (
                <ResponsiveContainer>
                  <BarChart data={revenueChart} margin={{ left: -8, right: 8, top: 8 }}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="m" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                    <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [fmt(v), "Revenue"]} />
                    <Bar dataKey="v" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </SectionCard>

          {/* Quick Stats */}
          <SectionCard title="Billing Summary">
            <div className="space-y-3">
              {[
                { label: "Total Invoiced", value: fmt(totalRevenue + pendingRevenue + partialRevenue), color: "text-foreground" },
                { label: "Collected (Paid)", value: fmt(totalRevenue), color: "text-success" },
                { label: "Pending Collection", value: fmt(pendingRevenue + partialRevenue), color: "text-warning" },
                { label: "Invoices Generated", value: String(orders.filter((o: any) => o.invoice_pdf_url).length), color: "text-gold" },
                { label: "WhatsApp Sent", value: String(orders.filter((o: any) => o.whatsapp_sent).length), color: "text-success" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-sm font-semibold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Invoice List */}
        <SectionCard title="All Invoices">
          <div className="flex flex-wrap items-center gap-2 -mt-1 mb-5">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, invoice #…"
                className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="this_month">This Month</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partially_paid">Partial</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse h-14 bg-border rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No invoices yet. Create your first order above.</p>
              <button onClick={() => setShowNewOrder(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90">
                <Plus className="h-4 w-4" /> Create First Order
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o: any) => (
                <div key={o.id} className="rounded-xl border border-border bg-background overflow-hidden">
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-accent/30 transition"
                    onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-gold font-medium">{o.invoice_number}</span>
                        <StatusPill tone={statusTone(o.status)}>{o.status.replace("_", " ")}</StatusPill>
                        {o.invoice_pdf_url && <span className="text-[10px] uppercase tracking-wider bg-success-soft text-success px-1.5 py-0.5 rounded-full">PDF Ready</span>}
                        {o.whatsapp_sent && <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">WA Sent</span>}
                      </div>
                      <div className="text-sm font-medium mt-0.5">{o.customer_name} · <span className="text-muted-foreground font-normal">{o.customer_phone}</span></div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-base">{fmt(o.total ?? 0)}</div>
                      <div className="text-xs text-muted-foreground">{fmtDate(o.created_at)}</div>
                    </div>
                    {expandedOrder === o.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  {/* Expanded */}
                  {expandedOrder === o.id && (
                    <div className="px-4 pb-4 border-t border-border bg-surface/50">
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        {/* Items */}
                        <div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Items</div>
                          <div className="space-y-1">
                            {(o.items as any[]).map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span>{item.qty}× {item.name}</span>
                                <span className="font-mono text-muted-foreground">₹{item.total.toLocaleString("en-IN")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        <div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Totals</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(o.subtotal ?? 0)}</span></div>
                            {(o.discount ?? 0) > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{fmt(o.discount)}</span></div>}
                            <div className="flex justify-between"><span className="text-muted-foreground">CGST</span><span>{fmt(o.cgst_amount ?? 0)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">SGST</span><span>{fmt(o.sgst_amount ?? 0)}</span></div>
                            <div className="flex justify-between font-semibold border-t border-border pt-1"><span>Total</span><span>{fmt(o.total ?? 0)}</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
                        {/* Status quick-set */}
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus.mutateAsync({ id: o.id, status: e.target.value })}
                          className="h-8 px-2 rounded-md border border-border bg-surface text-xs focus:outline-none"
                        >
                          {["pending", "paid", "partially_paid", "cancelled"].map((s) => (
                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => generateInvoice.mutateAsync(o.id)}
                          disabled={generateInvoice.isPending}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-surface text-xs font-medium hover:bg-accent disabled:opacity-60"
                        >
                          {generateInvoice.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />}
                          Generate PDF
                        </button>

                        {o.invoice_pdf_url && (
                          <a
                            href={o.invoice_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90"
                          >
                            <Download className="h-3 w-3" /> Download PDF
                          </a>
                        )}

                        <button
                          onClick={() => sendInvoice.mutateAsync(o.id)}
                          disabled={sendInvoice.isPending || !o.invoice_pdf_url}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-success text-success-foreground text-xs font-medium hover:opacity-90 disabled:opacity-60"
                          title={!o.invoice_pdf_url ? "Generate PDF first" : "Send via WhatsApp"}
                        >
                          {sendInvoice.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          Send WhatsApp
                        </button>

                        <button
                          onClick={() => deleteOrder.mutateAsync(o.id)}
                          disabled={deleteOrder.isPending}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive-soft disabled:opacity-60 ml-auto"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </main>

      {showNewOrder && (
        <NewOrderForm
          products={products}
          onSuccess={() => setShowNewOrder(false)}
          onClose={() => setShowNewOrder(false)}
        />
      )}
    </>
  );
}
