import { getDictionary, isLocale, defaultLocale } from "@/lib/i18n";

const PLATFORM_LINKS: Record<string, string> = {
  tiktok: "https://www.tiktok.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
  facebook: "https://www.facebook.com/",
  line: "https://line.me/",
};

export default function Home({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto max-w-4xl px-6">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 py-20 md:py-28">
        <p className="font-display text-lg italic text-clay dark:text-clay-dark">
          {dict.hero.eyebrow}
        </p>
        <h1 className="font-display text-6xl font-semibold leading-none text-ink md:text-8xl">
          {dict.hero.name}
        </h1>
        <p className="max-w-xl text-xl text-ink/80 md:text-2xl" style={{ textWrap: "balance" as any }}>
          {dict.hero.tagline}
        </p>
        <p className="max-w-xl text-base leading-relaxed text-ink/60">{dict.hero.sub}</p>
        <a
          href="#follow"
          className="mt-2 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-clay"
        >
          {dict.hero.cta}
        </a>
      </section>

      {/* About */}
      <section id="about" className="grid gap-6 border-t border-line py-16 md:grid-cols-[1fr_2fr] md:gap-12 md:py-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-clay">{dict.about.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{dict.about.title}</h2>
        </div>
        <div className="flex flex-col gap-4 text-lg leading-relaxed text-ink/75">
          <p>{dict.about.body1}</p>
          <p>{dict.about.body2}</p>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="border-t border-line py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wide text-clay">{dict.pillars.eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{dict.pillars.title}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {dict.pillars.items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white/50 p-6 dark:bg-white/[0.03]">
              <span className="font-display text-2xl text-clay">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Follow */}
      <section id="follow" className="border-t border-line py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-wide text-clay">{dict.follow.eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{dict.follow.title}</h2>
        <p className="mt-3 max-w-md text-ink/65">{dict.follow.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {Object.entries(dict.follow.platforms).map(([key, label]) => (
            <a
              key={key}
              href={PLATFORM_LINKS[key] ?? "#"}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:border-clay hover:text-clay"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-start gap-2 border-t border-line py-10 text-sm text-ink/50">
        <p>{dict.footer.note}</p>
        <p>&copy; {new Date().getFullYear()} Teddy</p>
      </footer>
    </main>
  );
}
