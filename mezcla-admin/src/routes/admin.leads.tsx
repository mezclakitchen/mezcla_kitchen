import { createFileRoute } from "@tanstack/react-router";
import { TopHeader } from "@/components/admin/TopHeader";
import { PageHeader, SectionCard } from "@/components/admin/ui";
import { useLeads, useDeleteLead } from "@/hooks/useApi";
import { Mail, Search, Trash2, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Newsletter Leads — Mezcla Admin" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useLeads({ search: search || undefined, limit: 100 });
  const deleteLead = useDeleteLead();

  const leads = data?.data ?? [];

  const handleExport = () => {
    if (leads.length === 0) return toast.error("No leads to export");
    const header = "Email,Name,Source,Subscribed At\n";
    const rows = leads.map((l: any) => `${l.email},${l.name || ""},${l.source || ""},${new Date(l.created_at).toLocaleString()}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mezcla-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <TopHeader title="Newsletter Leads" />
      <main className="flex-1 px-6 py-7">
        <PageHeader
          title="Newsletter Leads"
          subtitle="Subscribers from the Mezcla Circle. Export to use in email marketing."
          actions={
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-gold text-gold-foreground text-sm font-medium hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          }
        />

        <SectionCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email..."
                className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="text-sm text-muted-foreground ml-auto">
              Total: {data?.count ?? leads.length}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface border-b border-border text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Subscribed At</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-accent/30 transition">
                      <td className="px-4 py-3 font-medium">{lead.email}</td>
                      <td className="px-4 py-3">{lead.name || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="bg-surface px-2 py-1 rounded border border-border text-xs">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this lead?")) {
                              deleteLead.mutate(lead.id);
                            }
                          }}
                          disabled={deleteLead.isPending}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive-soft rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </main>
    </>
  );
}
