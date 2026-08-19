import { usePublicAnnouncements } from "@/hooks/usePublicApi";

export function AnnouncementBar() {
  const { data, isLoading } = usePublicAnnouncements();
  const announcements: any[] = data?.data ?? [];

  // While loading: show skeleton placeholder same height as bar — prevents layout flash
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-deep h-9 animate-pulse" />
    );
  }

  // Confirmed 0 active announcements — hide completely (no layout space)
  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-deep text-cocoa border-none outline-none">
      <div className="container-luxe py-2.5 text-center text-[0.7rem] tracking-[0.2em] uppercase font-medium overflow-hidden whitespace-nowrap">
        {announcements.length > 1 ? (
          <span className="inline-block animate-marquee w-full max-w-full">
            {announcements.map((a: any) => a.text).join("  ·  ")}
          </span>
        ) : (
          <span className="inline-block">{announcements[0]?.text}</span>
        )}
      </div>
    </div>
  );
}
