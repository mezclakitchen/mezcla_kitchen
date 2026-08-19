/**
 * OrderCutoffBanner — Shows a live countdown to the daily order cutoff time.
 * "Order before 5:00 PM today for Thursday delivery — 3h 24m left"
 * Disappears after the cutoff. Resets at midnight.
 */
import { useState, useEffect } from "react";
import { Timer, Zap } from "lucide-react";

const CUTOFF_HOUR = 17; // 5 PM

function getDeliveryDay(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toLocaleDateString("en-IN", { weekday: "long" });
}

function getTimeLeft(): { hours: number; minutes: number; seconds: number; expired: boolean } {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(CUTOFF_HOUR, 0, 0, 0);

  const diff = cutoff.getTime() - now.getTime();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, expired: false };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function OrderCutoffBanner() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const deliveryDay = getDeliveryDay(2); // Delivers in 2 days

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't show if cutoff has passed or more than 8 hours remain (keeps urgency)
  if (timeLeft.expired) return null;
  const totalMinutesLeft = timeLeft.hours * 60 + timeLeft.minutes;
  if (totalMinutesLeft > 8 * 60) return null; // only show in last 8 hours

  const isUrgent = totalMinutesLeft < 60; // less than 1 hour

  return (
    <div
      className={`w-full px-4 py-2.5 text-center text-[0.68rem] tracking-wide font-medium transition-colors ${
        isUrgent
          ? "bg-red-900/80 text-red-100"
          : "bg-espresso/80 text-ivory-muted"
      }`}
    >
      <div className="container-luxe flex flex-wrap items-center justify-center gap-2">
        {isUrgent ? (
          <Zap className="size-3.5 text-red-400 shrink-0" />
        ) : (
          <Timer className="size-3.5 text-gold shrink-0" />
        )}
        <span>
          {isUrgent ? "⚡ Last chance! " : "🕐 "}
          Order before{" "}
          <span className={`font-bold tabular-nums ${isUrgent ? "text-red-300" : "text-gold"}`}>
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
          {" "}for{" "}
          <span className="font-semibold text-cream">{deliveryDay}</span> delivery
        </span>
        {isUrgent && (
          <span className="animate-pulse text-red-300 font-bold">
            — Don't miss out!
          </span>
        )}
      </div>
    </div>
  );
}
