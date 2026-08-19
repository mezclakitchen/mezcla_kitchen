import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopHeader } from "@/components/admin/TopHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { PageHeader, SectionCard, StatusPill } from "@/components/admin/ui";
import { Users, Send, Eye, MessageCircle, Smartphone, Loader2 } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSendPromotion, useWhatsAppLogs } from "@/hooks/useApi";

export const Route = createFileRoute("/admin/promotions")({
  head: () => ({ meta: [{ title: "WhatsApp Promotions — Mezcla Admin" }] }),
  component: PromotionsPage,
});

const perf = Array.from({ length: 8 }).map((_, i) => ({ d: `W${i+1}`, sent: 200 + i*40, opened: 120 + i*32 }));
const engage = Array.from({ length: 7 }).map((_, i) => ({ d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], v: 30 + Math.round(Math.random()*40) }));

const audiences = [
  { id: "all", label: "All Customers", count: 1284 },
  { id: "recent", label: "Recent Customers", count: 312 },
  { id: "vip", label: "VIP Customers", count: 34 },
  { id: "hamper", label: "Hamper Customers", count: 186 },
  { id: "grazing", label: "Grazing Customers", count: 74 },
];

function PromotionsPage() {
  const [campaignName, setCampaignName] = useState("Monsoon Hampers — June 2026");
  const [audienceId, setAudienceId] = useState("all");
  const [message, setMessage] = useState("Hi {{name}} 👋\n\nOur monsoon hamper is here — sourdough, brie, fig jam and a tin of hot chocolate. ₹1,850, delivered to your door.\n\nReply YES to order.");

  const sendPromo = useSendPromotion();
  const { data: logsData } = useWhatsAppLogs({ type: "promotion" });
  const history = logsData?.data ?? [];

  async function handleSend() {
    if (!message.trim()) return;
    const body: any = { message: message.trim() };
    if (audienceId === "all") {
      body.allCustomers = true;
    } else {
      body.tags = [audienceId];
    }
    await sendPromo.mutateAsync(body);
  }

  return (
    <>
      <TopHeader title="WhatsApp Promotions" />
      <main className="flex-1 px-6 py-7">
        <PageHeader title="WhatsApp Marketing" subtitle="Reach the right customers with the right message." />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total Customers" value="1,284" icon={Users} change="+15.3%" accent="primary" />
          <KpiCard label="Campaigns Sent" value="48" icon={Send} change="+6" accent="gold" />
          <KpiCard label="Avg Open Rate" value="74.2%" icon={Eye} change="+3.4%" accent="success" />
          <KpiCard label="Avg Response Rate" value="22.1%" icon={MessageCircle} change="+2.1%" accent="success" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-6">
          <SectionCard title="Campaign Builder" className="xl:col-span-3">
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Campaign Name</label>
                <input value={campaignName} onChange={e => setCampaignName(e.target.value)} className="mt-1.5 w-full h-10 px-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Audience</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {audiences.map((a) => (
                    <button key={a.id} onClick={() => setAudienceId(a.id)} className={`p-3 rounded-md border text-left transition ${audienceId === a.id ? "border-gold bg-gold-soft" : "border-border bg-surface hover:border-border-strong"}`}>
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="text-xs text-muted-foreground">{a.count.toLocaleString()} contacts</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="mt-1.5 w-full px-3 py-2.5 rounded-md border border-border bg-surface text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <div className="mt-1 text-xs text-muted-foreground">Variables: {"{{name}}, {{order_id}}, {{amount}}"}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="h-10 px-4 rounded-md border border-border bg-surface text-sm font-medium hover:bg-accent">Save Draft</button>
                <button onClick={handleSend} disabled={sendPromo.isPending} className="h-10 px-4 rounded-md bg-success text-success-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2 disabled:opacity-60">
                  {sendPromo.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send Campaign
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Preview" className="xl:col-span-2">
            <div className="rounded-2xl border border-border bg-[#e7decf] p-4 min-h-[380px]">
              <div className="flex items-center gap-2 pb-3 border-b border-border-strong">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">Mezcla — The Artisanal Kitchen</div>
              </div>
              <div className="mt-4 max-w-[85%] rounded-xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm shadow-sm">
                <div className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {message.replace("{{name}}", "Priya")}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground text-right">10:42 AM ✓✓</div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
          <SectionCard title="Campaign Performance">
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={perf} margin={{ left: -8, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="sent" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="opened" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <SectionCard title="Customer Engagement">
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={engage} margin={{ left: -10, right: 8, top: 8 }}>
                  <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="var(--color-success)" strokeWidth={2} fill="url(#eg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Campaign History">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-3 px-2">Message Preview</th>
                <th className="text-left font-medium px-2">Recipients</th>
                <th className="text-left font-medium px-2">Date</th>
                <th className="text-left font-medium px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.length > 0 ? (
                history.map((h: any) => (
                  <tr key={h.id} className="hover:bg-accent/40">
                    <td className="py-3 px-2 font-medium truncate max-w-xs">{h.message?.substring(0, 50)}...</td>
                    <td className="px-2 text-muted-foreground">{h.recipient}</td>
                    <td className="px-2 text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</td>
                    <td className="px-2">
                      <StatusPill tone={h.status === 'sent' ? 'success' : h.status === 'failed' ? 'destructive' : 'neutral'}>
                        {h.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">No campaigns sent yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </SectionCard>
      </main>
    </>
  );
}
