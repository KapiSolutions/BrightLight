import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    req.headers.has("x-prerender-revalidate") || // exclude the revalidate request
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    const userLang = req.headers.get("accept-language")?.split(",")[0].trim();
    // const locale = req.cookies.get('NEXT_LOCALE')?.value || 'pl'
    const locale = userLang === "pl" ? "pl" : "en";

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}