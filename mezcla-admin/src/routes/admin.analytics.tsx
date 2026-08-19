import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard } from "@/components/admin/ui";
import {
  IndianRupee, Users, ShoppingBag, TrendingUp, Repeat, Wallet,
  Star, Package, MessageCircle, BarChart3,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Funnel, FunnelChart, LabelList, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Legend,
} from "recharts";
import { useDashboardAnalytics, useDashboardStats } from "@/hooks/useApi";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Mezcla Admin" }] }),
  component: AnalyticsPage,
});

// ─── Fallback / placeholder data ──────────────────────────────
const fallbackRevenue = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  v: 60000 + i * 6500,
}));
const fallbackProducts = [
  { n: "Sourdough Loaf", v: 38450 },
  { n: "Festive Hamper", v: 28950 },
  { n: "Hummus & Dips", v: 24680 },
  { n: "Snack Box", v: 18320 },
  { n: "Grazing Table", v: 14250 },
];
const fallbackCategories = [
  { name: "Breads", value: 34, color: "var(--color-gold)" },
  { name: "Hampers", value: 26, color: "var(--color-success)" },
  { name: "Dips", value: 18, color: "var(--color-primary)" },
  { name: "Snack Boxes", value: 14, color: "oklch(0.62 0.11 50)" },
  { name: "Other", value: 8, color: "oklch(0.74 0.06 110)" },
];
const fallbackGrowth = Array.from({ length: 8 }).map((_, i) => ({
  w: `W${i + 1}`, v: 80 + i * 24,
}));
const fallbackFunnel = [
  { name: "Visitors", value: 12480, fill: "var(--color-primary)" },
  { name: "Product Views", value: 7240, fill: "var(--color-gold)" },
  { name: "WhatsApp Enquiries", value: 2840, fill: "oklch(0.62 0.11 50)" },
  { name: "Confirmed Orders", value: 1480, fill: "oklch(0.55 0.085 150)" },
  { name: "Repeat Customers", value: 620, fill: "var(--color-success)" },
];
const fallbackTraffic = [
  { src: "Direct / WhatsApp", v: 42 },
  { src: "Google Search", v: 26 },
  { src: "Instagram", v: 18 },
  { src: "Referral", v: 9 },
  { src: "Other", v: 5 },
];
const fallbackHeat = Array.from({ length: 24 }).map((_, i) => ({
  h: i,
  v: Math.round(20 + Math.sin(i / 3) * 30 + 20),
}));
const fallbackReviewTrend = Array.from({ length: 6 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun"][i],
  count: 3 + i * 2,
  avg: 4.2 + i * 0.08,
}));
const fallbackDelivery = [
  { name: "Delivered On Time", value: 78, color: "var(--color-success)" },
  { name: "Delayed", value: 14, color: "var(--color-warning)" },
  { name: "Cancelled", value: 8, color: "var(--color-destructive)" },
];
const fallbackLeadSources = [
  { src: "WhatsApp Enquiry", v: 48 },
  { src: "Instagram DM", v: 22 },
  { src: "Website Contact", v: 15 },
  { src: "Referral", v: 10 },
  { src: "Google", v: 5 },
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Custom tooltip styling
const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

function AnalyticsPage() {
  const { data: analyticsRes } = useDashboardAnalytics();
  const { data: statsRes } = useDashboardStats();

  const analytics = analyticsRes?.data ?? {};
  const stats = statsRes?.data ?? {};

  const revenue = analytics.revenue?.length ? analytics.revenue : fallbackRevenue;
  const products = analytics.products?.length ? analytics.products : fallbackProducts;
  const categories = analytics.categories?.length ? analytics.categories : fallbackCategories;
  const growth = analytics.growth?.length ? analytics.growth : fallbackGrowth;
  const funnel = analytics.funnel?.length ? analytics.funnel : fallbackFunnel;
  const traffic = analytics.traffic?.length ? analytics.traffic : fallbackTraffic;
  const heat = analytics.heat?.length ? analytics.heat : fallbackHeat;
  const reviewTrend = analytics.reviewTrend?.length ? analytics.reviewTrend : fallbackReviewTrend;
  const delivery = analytics.delivery?.length ? analytics.delivery : fallbackDelivery;
  const leadSources = analytics.leadSources?.length ? analytics.leadSources : fallbackLeadSources;

  // Orders by status donut from stats
  const ordersDonut = useMemo(() => {
    if (!stats?.totalOrders) return fallbackDelivery;
    return [
      { name: "Paid", value: stats.totalOrders - (stats.pendingOrders ?? 0), color: "var(--color-success)" },
      { name: "Pending", value: stats.pendingOrders ?? 0, color: "var(--color-warning)" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  return (
    <>
      <TopHeader title="Analytics" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Business Intelligence"
          subtitle="Your executive view of everything that matters — updated daily."
        />

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KpiCard label="Revenue MTD" value={fmt(stats.totalRevenue ?? 0)} icon={IndianRupee} change={stats.revenueGrowth ?? "+0%"} accent="success" />
          <KpiCard label="Customers" value={String(stats.totalCustomers ?? 0)} icon={Users} change="+growing" accent="primary" />
          <KpiCard label="Orders" value={String(stats.totalOrders ?? 0)} icon={ShoppingBag} change="+growing" accent="gold" />
          <KpiCard label="Growth" value={stats.revenueGrowth ?? "0%"} icon={TrendingUp} change="active" accent="success" />
          <KpiCard label="Avg Order" value={stats.totalOrders > 0 ? fmt(Math.round(stats.totalRevenue / stats.totalOrders)) : "₹0"} icon={Wallet} change="stable" accent="primary" />
          <KpiCard label="Pending Orders" value={String(stats.pendingOrders ?? 0)} icon={Package} change={stats.pendingOrders > 0 ? "needs attention" : "all clear"} trend={stats.pendingOrders > 0 ? "down" : "up"} accent={stats.pendingOrders > 0 ? "warning" : "success"} />
        </div>

        {/* ── Row 1: Revenue Trend + Category Performance ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard title="Revenue Trend" className="xl:col-span-2" action={<span className="text-xs text-muted-foreground">Last 12 months</span>}>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={revenue} margin={{ left: -8, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="arev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [fmt(v), "Revenue"]} />
                  <Area type="monotone" dataKey="v" stroke="var(--color-gold)" strokeWidth={2} fill="url(#arev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Category Performance">
            <div className="h-72 flex flex-col items-center">
              <div className="w-full h-44">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={categories} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2} stroke="none">
                      {categories.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="w-full space-y-1.5 text-sm mt-2">
                {categories.map((c: any) => (
                  <li key={c.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                      {c.name}
                    </span>
                    <span className="text-muted-foreground">{c.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </div>

        {/* ── Row 2: Customer Growth + Enquiry Funnel ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard title="Customer Growth (Last 8 Weeks)">
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={growth} margin={{ left: -10, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="w" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="v" stroke="var(--color-success)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-success)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Enquiry → Purchase Funnel" className="xl:col-span-2">
            <div className="h-56">
              <ResponsiveContainer>
                <FunnelChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Funnel dataKey="value" data={funnel} isAnimationActive>
                    <LabelList position="right" fill="var(--color-foreground)" stroke="none" dataKey="name" fontSize={11} />
                    <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={12} />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* ── Row 3: Top Products + Orders by Status + Leads by Source ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard title="Top Products by Revenue">
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={products} layout="vertical" margin={{ left: 4, right: 16, top: 4 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={10} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`} />
                  <YAxis type="category" dataKey="n" fontSize={10} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [fmt(v), "Revenue"]} />
                  <Bar dataKey="v" fill="var(--color-gold)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Orders by Status">
            <div className="h-56 flex flex-col items-center justify-center gap-4">
              <div className="w-full h-40">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={ordersDonut} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                      {ordersDonut.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="w-full space-y-1.5 text-sm">
                {ordersDonut.map((s: any) => (
                  <li key={s.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="text-muted-foreground font-mono">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Leads by Source">
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={leadSources} margin={{ left: -10, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="src" fontSize={9} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="v" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* ── Row 4: Review Trend + Delivery Status + Traffic Sources ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
          <SectionCard title="Review Trend">
            <div className="h-52">
              <ResponsiveContainer>
                <AreaChart data={reviewTrend} margin={{ left: -10, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="revgrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="count" stroke="var(--color-gold)" strokeWidth={2} fill="url(#revgrad)" name="Reviews" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span>Average rating: <strong className="text-foreground">4.8★</strong></span>
            </div>
          </SectionCard>

          <SectionCard title="Delivery Performance">
            <div className="space-y-4 pt-2">
              {delivery.map((d: any) => (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-medium tabular-nums">{d.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.value}%`, background: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Based on all orders placed this month.</p>
          </SectionCard>

          <SectionCard title="Traffic Sources">
            <ul className="space-y-3 text-sm pt-2">
              {traffic.map((t: any) => (
                <li key={t.src}>
                  <div className="flex justify-between mb-1">
                    <span>{t.src}</span>
                    <span className="text-muted-foreground">{t.v}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${t.v * 2}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* ── Row 5: Activity Heatmap + Analytics Integrations ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <SectionCard title="Order Activity Heatmap" action={<span className="text-xs text-muted-foreground">By hour of day</span>} className="xl:col-span-2">
            <div className="h-44">
              <ResponsiveContainer>
                <BarChart data={heat} margin={{ left: -10, right: 4, top: 8 }}>
                  <XAxis dataKey="h" fontSize={10} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(h) => `${h}:00`} />
                  <YAxis fontSize={10} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={(h) => `${h}:00 – ${h + 1}:00`} />
                  <Bar dataKey="v" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Analytics Integrations">
            <div className="space-y-3 text-sm">
              {[
                { label: "Google Analytics 4", key: "ga", status: "Configure" },
                { label: "Microsoft Clarity", key: "clarity", status: "Configure" },
                { label: "Google Search Console", key: "gsc", status: "Configure" },
                { label: "WhatsApp Business", key: "wa", status: "Active" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "Active" ? "bg-success-soft text-success" : "bg-border text-muted-foreground"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                Add your GA Measurement ID and Clarity Project ID to <code className="bg-muted px-1 rounded">.env</code> to enable real tracking.
              </p>
            </div>
          </SectionCard>
        </div>
      </main>
    </>
  );
}
