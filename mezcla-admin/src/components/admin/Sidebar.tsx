import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ShoppingBag, Receipt, Package, FolderTree, Images,
  Star, Users, BarChart3, Settings, Mail, BookOpen, Gift
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id?: string;
  to: string;
  hash?: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
};

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/billing", label: "Billing", icon: Receipt },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/menus", label: "Menus", icon: BookOpen },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { id: "leads", to: "/admin/leads", label: "Newsletter Leads", icon: Mail },
  { id: "festive", to: "/admin/festive", label: "Festive Offers", icon: Gift },
  { id: "settings", to: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 pt-7 pb-6 border-b border-sidebar-border">
        <Link to="/admin" className="block px-2">
          <img src="/logo-filled.png" alt="Mezcla Logo" className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to + (item.hash || "")}
              to={item.to as "/admin"}
              hash={item.hash}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-gold"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-gold" : "text-sidebar-muted group-hover:text-sidebar-foreground")} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] uppercase tracking-wider rounded-full bg-gold/15 text-gold px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg bg-sidebar-accent/60 border border-sidebar-border p-4">
        <div className="text-sm font-medium">Need a hand?</div>
        <p className="text-xs text-sidebar-muted mt-1">We're here for anything you need.</p>
        <button className="mt-3 w-full rounded-md bg-gold text-gold-foreground text-xs font-medium py-2 hover:opacity-90">
          Contact Support
        </button>
      </div>
    </aside>
  );
}
