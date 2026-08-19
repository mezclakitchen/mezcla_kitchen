import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import {
  ShoppingBag, Clock, CheckCircle2, XCircle, Search, Filter,
  Eye, FileText, Trash2, Loader2, ChevronLeft, ChevronRight, Check, X,
} from "lucide-react";
import { useState } from "react";
import { useOrders, useUpdateOrderStatus, useDeleteOrder, useGenerateInvoice } from "@/hooks/useApi";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Mezcla Admin" }] }),
  component: OrdersPage,
});

const STATUS_OPTIONS = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "partially_paid", label: "Partial" },
  { value: "cancelled", label: "Cancelled" },
];

const statusTone = (s: string): any => ({
  paid: "success", pending: "warning", partially_paid: "gold", cancelled: "destructive",
}[s] ?? "primary");

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isLoading } = useOrders({ status: statusFilter || undefined, search: search || undefined, page });
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const generateInvoice = useGenerateInvoice();

  const orders = data?.data ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.ceil(total / 20);

  const stats = {
    total: total,
    pending: orders.filter((o: any) => o.status === "pending").length,
    paid: orders.filter((o: any) => o.status === "paid").length,
    cancelled: orders.filter((o: any) => o.status === "cancelled").length,
  };

  return (
    <>
      <TopHeader title="Orders" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Order Management"
          subtitle="View and manage all customer orders."
        />

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total Orders" value={String(total)} icon={ShoppingBag} change="" accent="primary" />
          <KpiCard label="Pending" value={String(stats.pending)} icon={Clock} change="" accent="warning" />
          <KpiCard label="Paid" value={String(stats.paid)} icon={CheckCircle2} change="" accent="success" />
          <KpiCard label="Cancelled" value={String(stats.cancelled)} icon={XCircle} change="" accent="destructive" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Orders Table */}
          <SectionCard className="xl:col-span-2">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 -mt-1 mb-5">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name, phone, invoice…"
                  className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="text-left font-medium py-3">Invoice</th>
                    <th className="text-left font-medium">Customer</th>
                    <th className="text-left font-medium">Amount</th>
                    <th className="text-left font-medium">Status</th>
                    <th className="text-left font-medium">Date</th>
                    <th className="text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="py-3">
                            <div className="animate-pulse h-4 bg-border rounded w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((o: any) => (
                      <tr
                        key={o.id}
                        className={`hover:bg-accent/30 cursor-pointer transition ${selectedOrder?.id === o.id ? "bg-accent" : ""}`}
                        onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)}
                      >
                        <td className="py-3 font-mono text-xs">{o.invoice_number}</td>
                        <td className="font-medium">
                          <div>{o.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                        </td>
                        <td className="font-display">{fmt(o.total ?? 0)}</td>
                        <td><StatusPill tone={statusTone(o.status)}>{o.status.replace("_", " ")}</StatusPill></td>
                        <td className="text-muted-foreground text-xs">{fmtDate(o.created_at)}</td>
                        <td className="text-right">
                          <div className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                              title="View details"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => generateInvoice.mutateAsync(o.id)}
                              disabled={generateInvoice.isPending}
                              className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                              title="Generate PDF"
                            >
                              <FileText className="h-3.5 w-3.5 text-primary" />
                            </button>
                            <button
                              onClick={() => deleteOrder.mutateAsync(o.id)}
                              disabled={deleteOrder.isPending}
                              className="h-7 w-7 grid place-items-center rounded hover:bg-accent"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {pageCount} · {total} orders total
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-accent disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={page >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-accent disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Order Detail Panel */}
          <SectionCard title={selectedOrder ? `Order #${selectedOrder.invoice_number}` : "Order Details"}>
            {!selectedOrder ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Click an order to view details
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <StatusPill tone={statusTone(selectedOrder.status)}>{selectedOrder.status.replace("_", " ")}</StatusPill>
                  <span className="text-xs text-muted-foreground">{fmtDate(selectedOrder.created_at)}</span>
                </div>

                <div className="p-3 rounded-lg bg-background border border-border">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Customer</div>
                  <div className="font-medium">{selectedOrder.customer_name}</div>
                  <div className="text-muted-foreground text-xs">{selectedOrder.customer_phone}</div>
                  {selectedOrder.customer_email && <div className="text-muted-foreground text-xs">{selectedOrder.customer_email}</div>}
                  {selectedOrder.customer_address && <div className="text-muted-foreground text-xs">{selectedOrder.customer_address}</div>}
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Items</div>
                  <div className="space-y-1.5">
                    {(selectedOrder.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span>{item.qty}× {item.name}</span>
                        <span className="font-mono">{fmt(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(selectedOrder.subtotal ?? 0)}</span></div>
                  {(selectedOrder.discount ?? 0) > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{fmt(selectedOrder.discount)}</span></div>}
                  {(selectedOrder.delivery_charge ?? 0) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{fmt(selectedOrder.delivery_charge)}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">CGST ({selectedOrder.cgst_pct}%)</span><span>{fmt(selectedOrder.cgst_amount ?? 0)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SGST ({selectedOrder.sgst_pct}%)</span><span>{fmt(selectedOrder.sgst_amount ?? 0)}</span></div>
                  <div className="flex justify-between font-display text-base pt-2 border-t border-border"><span>Total</span><span>{fmt(selectedOrder.total ?? 0)}</span></div>
                </div>

                {/* Status update */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Update Status</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { s: "paid", label: "Mark Paid", icon: Check, cls: "bg-success text-success-foreground" },
                      { s: "pending", label: "Pending", icon: Clock, cls: "bg-warning text-foreground" },
                      { s: "partially_paid", label: "Partial", icon: Clock, cls: "bg-gold text-gold-foreground" },
                      { s: "cancelled", label: "Cancel", icon: X, cls: "bg-destructive text-destructive-foreground" },
                    ].map(({ s, label, icon: Icon, cls }) => (
                      <button
                        key={s}
                        disabled={selectedOrder.status === s || updateStatus.isPending}
                        onClick={() => updateStatus.mutateAsync({ id: selectedOrder.id, status: s })}
                        className={`h-9 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition ${cls} disabled:opacity-40`}
                      >
                        {updateStatus.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Icon className="h-3 w-3" />}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PDF / Invoice */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => generateInvoice.mutateAsync(selectedOrder.id)}
                    disabled={generateInvoice.isPending}
                    className="flex-1 h-9 rounded-md border border-border text-xs font-medium hover:bg-accent flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {generateInvoice.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                    Generate PDF
                  </button>
                  {selectedOrder.invoice_pdf_url && (
                    <a
                      href={selectedOrder.invoice_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-9 rounded-md bg-gold text-gold-foreground text-xs font-medium hover:opacity-90 flex items-center justify-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" /> Download PDF
                    </a>
                  )}
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </main>
    </>
  );
}
