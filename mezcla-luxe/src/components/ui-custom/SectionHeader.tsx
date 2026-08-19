export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"} mb-12`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className={`font-display text-4xl md:text-5xl leading-[1.05] ${dark ? "text-cream" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base md:text-lg leading-relaxed ${dark ? "text-ivory-muted" : "text-ink-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
