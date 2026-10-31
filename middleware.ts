import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

function pickLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());
  for (const pref of preferred) {
    const short = pref.split("-")[0];
    if ((locales as readonly string[]).includes(short)) return short;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const locale = pickLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Exclude Next internals, API routes, the (unlocalized) dashboard and
  // posts pages, static files, and favicon from the locale redirect.
  matcher: ["/((?!_next|api|dashboard|posts|favicon.ico|.*\\..*).*)"],
};
