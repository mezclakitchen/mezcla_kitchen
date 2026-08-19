/**
 * SocialProofTicker — A floating notification-style pop-up that cycles through
 * realistic social proof messages (Zomato/Swiggy style).
 * Shows in bottom-left corner, auto-dismisses, cycles every ~6 seconds.
 */
import { useState, useEffect } from "react";
import { ShoppingBag, Star, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

type Notification = {
  icon: React.ElementType;
  color: string;
  message: string;
  sub?: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    icon: ShoppingBag,
    color: "text-green-400",
    message: "Priya from Indiranagar",
    sub: "just ordered a Grazing Table 🎉",
  },
  {
    icon: Users,
    color: "text-blue-400",
    message: "8 people are viewing",
    sub: "the Sourdough collection right now",
  },
  {
    icon: Star,
    color: "text-gold",
    message: "Meera left a 5★ review",
    sub: "\"Best hampers in Bangalore!\"",
  },
  {
    icon: ShoppingBag,
    color: "text-green-400",
    message: "Rahul from Koramangala",
    sub: "ordered a Festive Hamper 🎁",
  },
  {
    icon: Users,
    color: "text-amber-400",
    message: "3 people ordered today",
    sub: "the Dips & Sourdough combo",
  },
  {
    icon: WhatsAppIcon,
    color: "text-green-500",
    message: "Sneha is chatting with us",
    sub: "about a custom snack box",
  },
  {
    icon: ShoppingBag,
    color: "text-green-400",
    message: "Ananya from HSR Layout",
    sub: "ordered Birthday Hamper 🎂",
  },
  {
    icon: Star,
    color: "text-gold",
    message: "10+ repeat customers",
    sub: "ordered again this week 💛",
  },
];

export function SocialProofTicker() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    // Auto-dismiss after 4 seconds
    const dismissTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setExiting(false);
        setVisible(false);
        // Show next after a 3-second gap
        setTimeout(() => {
          setIndex((i) => (i + 1) % NOTIFICATIONS.length);
          setVisible(true);
        }, 3000);
      }, 400);
    }, 4500);

    return () => clearTimeout(dismissTimer);
  }, [visible, index]);

  if (!visible) return null;

  const notif = NOTIFICATIONS[index];
  const Icon = notif.icon;

  return (
    <div
      className={`fixed bottom-24 left-4 z-40 max-w-[280px] transition-all duration-400 ${
        exiting
          ? "opacity-0 translate-x-[-20px]"
          : "opacity-100 translate-x-0"
      }`}
      style={{
        animation: exiting ? "none" : "slideInLeft 0.4s ease-out",
      }}
    >
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="bg-cocoa/95 backdrop-blur-sm border border-gold/20 rounded-2xl p-3.5 shadow-2xl flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 size-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Icon className={`size-4 ${notif.color}`} />
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-cream font-medium text-xs leading-tight">{notif.message}</p>
          {notif.sub && (
            <p className="text-ivory-muted text-[0.65rem] mt-0.5 leading-tight">{notif.sub}</p>
          )}
        </div>
        {/* Live dot */}
        <div className="shrink-0 mt-1">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-green-500" />
          </span>
        </div>
      </div>
    </div>
  );
}
