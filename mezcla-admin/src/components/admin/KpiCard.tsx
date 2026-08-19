import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Trend = "up" | "down" | "neutral";

export function KpiCard({
  label, value, icon: Icon, change, trend = "up", spark, accent = "gold",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  trend?: Trend;
  spark?: number[];
  accent?: "gold" | "success" | "warning" | "destructive" | "primary";
}) {
  const stroke =
    accent === "success" ? "var(--color-success)" :
    accent === "warning" ? "var(--color-warning)" :
    accent === "destructive" ? "var(--color-destructive)" :
    accent === "primary" ? "var(--color-primary)" :
    "var(--color-gold)";

  const iconBg =
    accent === "success" ? "bg-success-soft text-success" :
    accent === "warning" ? "bg-warning-soft text-warning" :
    accent === "destructive" ? "bg-destructive-soft text-destructive" :
    accent === "primary" ? "bg-secondary text-primary" :
    "bg-gold-soft text-gold-foreground";

  const data = (spark ?? [4, 6, 5, 7, 6, 9, 8, 11, 10, 13, 12, 15]).map((v, i) => ({ i, v }));

  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <span className={cn("h-8 w-8 rounded-md grid place-items-center", iconBg)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 font-display text-3xl text-foreground">{value}</div>
      {change && (
        <div className="mt-1 flex items-center gap-1 text-xs">
          {trend === "down" ? (
            <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5 text-success" />
          )}
          <span className={trend === "down" ? "text-destructive" : "text-success"}>{change}</span>
          <span className="text-muted-foreground">from last 30 days</span>
        </div>
      )}
      <div className="-mx-2 mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.75} fill={`url(#sg-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
