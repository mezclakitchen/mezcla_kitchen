/**
 * BakeScheduleWidget — Sourdough bake day countdown
 * Shows the next bake day and a countdown timer.
 * Bake days: Monday, Wednesday, Saturday.
 */
import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useWhatsApp } from "@/hooks/useWhatsApp";

const BAKE_DAYS = [1, 3, 6]; // Monday=1, Wednesday=3, Saturday=6

function getNextBakeDay(): { dayName: string; date: Date; daysAway: number } {
  const now = new Date();
  const today = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  let minDays = Infinity;
  let nextDay = -1;

  for (const bakeDay of BAKE_DAYS) {
    let daysUntil = bakeDay - today;
    if (daysUntil <= 0) daysUntil += 7; // wrap to next week
    if (daysUntil < minDays) {
      minDays = daysUntil;
      nextDay = bakeDay;
    }
  }

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + minDays);
  nextDate.setHours(8, 0, 0, 0); // Bakes start at 8 AM

  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return { dayName: DAY_NAMES[nextDay], date: nextDate, daysAway: minDays };
}

function getCountdown(target: Date): { d: number; h: number; m: number } {
  const diff = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { d, h, m };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function BakeScheduleWidget() {
  const { generateWhatsAppLink } = useWhatsApp();
  const [bakeInfo] = useState(getNextBakeDay);
  const [countdown, setCountdown] = useState(getCountdown(bakeInfo.date));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(bakeInfo.date));
    }, 60_000); // update every minute
    return () => clearInterval(interval);
  }, [bakeInfo.date]);

  const isToday = bakeInfo.daysAway === 0;
  const isTomorrow = bakeInfo.daysAway === 1;

  return (
    <section className="bg-gradient-to-br from-cocoa via-espresso to-cocoa border-y border-gold/10 py-12">
      <div className="container-luxe">
        <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
          {/* Left — Label */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
              <Calendar className="size-4 text-gold" />
              <p className="eyebrow text-gold">Sourdough Bake Schedule</p>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl text-cream">
              Next Fresh Bake:{" "}
              <span className="italic text-gold">
                {isToday ? "Today!" : isTomorrow ? "Tomorrow" : bakeInfo.dayName}
              </span>
            </h2>
            <p className="mt-2 text-ivory-muted text-sm max-w-sm">
              Our sourdough ferments for 24–48 hours before baking. Pre-order to
              secure your loaf from {isToday ? "today's" : `${bakeInfo.dayName}'s`} fresh batch.
            </p>
          </div>

          {/* Center — Countdown */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="font-display text-5xl text-gold tabular-nums leading-none">
                {pad(countdown.d)}
              </div>
              <div className="text-[0.6rem] uppercase tracking-widest text-ivory-muted mt-1">Days</div>
            </div>
            <div className="text-gold/40 font-display text-4xl">:</div>
            <div className="text-center">
              <div className="font-display text-5xl text-gold tabular-nums leading-none">
                {pad(countdown.h)}
              </div>
              <div className="text-[0.6rem] uppercase tracking-widest text-ivory-muted mt-1">Hours</div>
            </div>
            <div className="text-gold/40 font-display text-4xl">:</div>
            <div className="text-center">
              <div className="font-display text-5xl text-gold tabular-nums leading-none">
                {pad(countdown.m)}
              </div>
              <div className="text-[0.6rem] uppercase tracking-widest text-ivory-muted mt-1">Mins</div>
            </div>
          </div>

          {/* Right — CTA */}
          <div className="text-center lg:text-right">
            <div className="flex items-center gap-1.5 text-ivory-muted text-xs mb-3 justify-center lg:justify-end">
              <Clock className="size-3 text-gold" />
              <span>Order by 5 PM the day before to guarantee your loaf</span>
            </div>
            <a
              href={generateWhatsAppLink("Hi! I'd like to pre-order sourdough bread from the next bake batch. 🍞")}
              target="_blank"
              rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 text-sm"
            >
              <WhatsAppIcon className="size-4" />
              Reserve Your Loaf →
            </a>
            <p className="text-[0.62rem] text-ivory-muted/60 mt-2">
              Bake days: Mon · Wed · Sat
            </p>
          </div>
        </div>

        {/* Bake day pills */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            { day: "Monday", active: bakeInfo.dayName === "Monday" && !isToday },
            { day: "Wednesday", active: bakeInfo.dayName === "Wednesday" && !isToday },
            { day: "Saturday", active: bakeInfo.dayName === "Saturday" && !isToday },
          ].map(({ day, active }) => (
            <span
              key={day}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-gold/20 border-gold text-gold"
                  : "bg-transparent border-ivory-muted/20 text-ivory-muted/50"
              }`}
            >
              {day}
            </span>
          ))}
          {isToday && (
            <span className="px-4 py-1.5 rounded-full text-xs font-bold border border-green-500 bg-green-500/20 text-green-400 animate-pulse">
              🔥 Baking Today!
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
