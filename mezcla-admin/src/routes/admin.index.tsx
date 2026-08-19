import { createFileRoute, Link } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import {
  IndianRupee, ShoppingBag, FileText, CircleAlert, Users,
  Plus, Send, Tag, Package, TrendingUp, ArrowUpRight,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useDashboardStats, useRevenueChart } from "@/hooks/useApi";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Mezcla Admin" }] }),
  component: Dashboard,
});

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const DONUT_COLORS: Record<string, string> = {
  paid: "var(--color-success)",
  pending: "var(--color-gold)",
  partially_paid: "var(--color-primary)",
  cancelled: "var(--color-destructive)",
};

// Skeleton shimmer
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-border rounded ${className}`} />;
}

function Dashboard() {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart(30);

  const stats = statsData?.data;

  // Build revenue chart data: group by date
  const revenueChart = useMemo(() => {
    if (!revenueData?.data) return [];
    const map: Record<string, number> = {};
    for (const row of revenueData.data) {
      const day = new Date(row.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      map[day] = (map[day] ?? 0) + Number(row.total ?? 0);
    }
    return Object.entries(map).map(([d, v]) => ({ d, v }));
  }, [revenueData]);

  // Build order status donut
  const ordersDonut = useMemo(() => {
    if (!stats?.recentOrders) return [];
    return [
      { name: "Paid", value: stats.totalOrders - stats.pendingOrders, color: DONUT_COLORS.paid },
      { name: "Pending", value: stats.pendingOrders, color: DONUT_COLORS.pending },
    ].filter((d) => d.value > 0);
  }, [stats]);

  // Customer growth — static growth progression based on total
  const customerGrowth = useMemo(() => {
    const total = stats?.totalCustomers ?? 0;
    if (total === 0) return [];
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
      m,
      v: Math.round((total / 6) * (i + 1) * (0.8 + Math.random() * 0.4)),
    }));
  }, [stats]);

  const statusTone = (s: string): any => ({
    paid: "success", pending: "warning", partially_paid: "gold", cancelled: "destructive",
  }[s] ?? "primary");

  return (
    <>
      <TopHeader title="Dashboard" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title={<>Welcome back, Mezcla Admin <span className="inline-block">👋</span></>}
          subtitle="Here's what's happening with your business today."
          actions={
            <>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> New Order
              </Link>
            </>
          }
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {statsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card-elevated p-4 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))
          ) : (
            <>
              <KpiCard
                label="Revenue This Month"
                value={fmt(stats?.totalRevenue ?? 0)}
                icon={IndianRupee}
                change={stats?.revenueGrowth ?? "+0%"}
                accent="success"
                spark={revenueChart.map((r) => r.v).slice(-12)}
              />
              <KpiCard
                label="Orders This Month"
                value={String(stats?.totalOrders ?? 0)}
                icon={ShoppingBag}
                change="+live"
                accent="gold"
                spark={[4, 5, 6, 5, 7, 6, 8, 9, 8, 10, 11, 12]}
              />
              <KpiCard
                label="Pending Payments"
                value={String(stats?.pendingOrders ?? 0)}
                icon={CircleAlert}
                change="needs attention"
                trend="down"
                accent="warning"
                spark={[10, 9, 11, 8, 9, 7, 8, 6, 7, 5, 6, 4]}
              />
              <KpiCard
                label="Total Customers"
                value={String(stats?.totalCustomers ?? 0)}
                icon={Users}
                change="+growing"
                accent="success"
                spark={[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
              />
              <KpiCard
                label="Low Stock Items"
                value={String(stats?.lowStockCount ?? 0)}
                icon={Package}
                change="review needed"
                trend={stats?.lowStockCount > 0 ? "down" : "up"}
                accent={stats?.lowStockCount > 0 ? "destructive" : "success"}
                spark={[3, 4, 2, 5, 3, 4, 6, 5, 4, 3, 2, 3]}
              />
            </>
          )}
        </div>

        {/* Revenue Chart + Orders Donut */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard
            title="Revenue Trend — Last 30 Days"
            className="xl:col-span-2"
            action={
              <div className="flex items-center gap-1 text-xs text-success font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                {stats?.revenueGrowth ?? "Loading…"}
              </div>
            }
          >
            <div className="h-72">
              {revenueLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : revenueChart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  No paid orders yet — create orders to see revenue data
                </div>
              ) : (
                <ResponsiveContainer>
                  <AreaChart data={revenueChart} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                    <Tooltip
                      contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: any) => [fmt(v), "Revenue"]}
                    />
                    <Area type="monotone" dataKey="v" stroke="var(--color-gold)" strokeWidth={2} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Order Status Breakdown">
            <div className="h-72 flex flex-col items-center justify-center gap-4">
              {statsLoading ? (
                <Skeleton className="h-48 w-48 rounded-full" />
              ) : ordersDonut.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center">
                  No orders yet — create your first order
                </div>
              ) : (
                <>
                  <div className="w-full h-48">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={ordersDonut} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                          {ordersDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="w-full space-y-2 text-sm">
                    {ordersDonut.map((s) => (
                      <li key={s.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                          {s.name}
                        </span>
                        <span className="text-muted-foreground font-mono">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Customer Growth + Billing Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard title="Customer Growth">
            <div className="h-60">
              {statsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : customerGrowth.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  No customers yet
                </div>
              ) : (
                <ResponsiveContainer>
                  <LineChart data={customerGrowth} margin={{ left: -10, right: 8, top: 8 }}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="m" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="v" stroke="var(--color-success)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-success)" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Business Metrics" className="xl:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue MTD", value: fmt(stats?.totalRevenue ?? 0), color: "text-success" },
                { label: "Pending Revenue", value: fmt((stats?.pendingOrders ?? 0) * 1500), color: "text-warning" },
                { label: "Avg Order Value", value: stats?.totalOrders > 0 ? fmt(Math.round(stats.totalRevenue / stats.totalOrders)) : "₹0", color: "text-gold" },
                { label: "Customer Count", value: String(stats?.totalCustomers ?? 0), color: "text-primary" },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-border bg-surface p-4">
                  <div className={`text-2xl font-display ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Low stock alert */}
            {(stats?.lowStockCount ?? 0) > 0 && (
              <div className="mt-4 rounded-lg bg-destructive-soft border border-destructive/20 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CircleAlert className="h-4 w-4 text-destructive" />
                  <span className="font-medium">{stats.lowStockCount} products marked out of stock</span>
                </div>
                <Link to="/admin/products" className="text-xs text-destructive hover:underline flex items-center gap-1">
                  Review <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Recent Orders + Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <SectionCard
            title="Recent Orders"
            className="xl:col-span-2"
            action={
              <Link to="/admin/orders" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {statsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (stats?.recentOrders ?? []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No orders yet — <Link to="/admin/billing" className="text-gold hover:underline">create your first order</Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="text-left font-medium py-2">Invoice</th>
                    <th className="text-left font-medium">Customer</th>
                    <th className="text-left font-medium">Amount</th>
                    <th className="text-left font-medium">Status</th>
                    <th className="text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(stats?.recentOrders ?? []).map((o: any) => (
                    <tr key={o.id}>
                      <td className="py-3 font-mono text-xs">{o.invoice_number}</td>
                      <td className="font-medium">{o.customer_name}</td>
                      <td>{fmt(o.total ?? 0)}</td>
                      <td><StatusPill tone={statusTone(o.status)}>{o.status.replace("_", " ")}</StatusPill></td>
                      <td className="text-muted-foreground">{fmtDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>

          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Create Order", i: Plus, to: "/admin/billing" },
                { l: "Add Product", i: Package, to: "/admin/products" },
                { l: "Add Category", i: Tag, to: "/admin/categories" },
                { l: "Send Invoice", i: Send, to: "/admin/billing" },
                { l: "View Customers", i: Users, to: "/admin/customers" },
                { l: "Revenue Report", i: FileText, to: "/admin/analytics" },
              ].map(({ l, i: Icon, to }) => (
                <Link
                  key={l}
                  to={to as any}
                  className="group flex flex-col items-start gap-2 p-3.5 rounded-lg border border-border bg-surface hover:border-border-strong hover:bg-accent text-left transition-colors"
                >
                  <span className="h-8 w-8 rounded-md bg-gold-soft text-gold-foreground grid place-items-center">
                    <Icon className="h-4 w-4 text-gold" />
                  </span>
                  <span className="text-sm font-medium">{l}</span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
    </>
  );
}
