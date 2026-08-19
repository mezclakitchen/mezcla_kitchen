import { Outlet } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import { StickyWhatsApp } from "./StickyWhatsApp";
import { MobileBottomBar } from "./MobileBottomBar";

export function SiteShell() {
  return (
    <div className="min-h-screen flex flex-col bg-cocoa text-cream relative">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "var(--gradient-radial-warm)" }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <StickyWhatsApp />
        <MobileBottomBar />
      </div>
    </div>
  );
}
