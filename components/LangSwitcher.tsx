"use client";

import { usePathname } from "next/navigation";
import { locales, Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = { en: "EN", th: "TH", zh: "中文" };

export default function LangSwitcher({ current }: { current: string }) {
  const pathname = usePathname() || "/";
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Language">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          <a
            href={`/${locale}${rest ? `/${rest}` : ""}`}
            className={
              locale === current
                ? "rounded-full bg-clay px-2.5 py-1 font-medium text-paper"
                : "rounded-full px-2.5 py-1 text-ink/60 hover:text-ink"
            }
          >
            {labels[locale]}
          </a>
          {i < locales.length - 1 && <span className="text-ink/20">/</span>}
        </span>
      ))}
    </nav>
  );
}
