export function PolicyShell({
  eyebrow, title, intro, sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { h: string; p: React.ReactNode }[];
}) {
  return (
    <>
      <section className="bg-cocoa py-20 border-b hairline">
        <div className="container-luxe max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl text-cream">{title}</h1>
          <p className="mt-5 text-ivory-muted leading-relaxed">{intro}</p>
        </div>
      </section>
      <section className="bg-cream text-ink py-20">
        <div className="container-luxe max-w-3xl space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl">{s.h}</h2>
              <p className="mt-3 text-ink-muted leading-relaxed">{s.p}</p>
            </div>
          ))}
          <p className="text-xs text-ink-muted">Last updated · {new Date().toLocaleDateString()}</p>
        </div>
      </section>
    </>
  );
}
