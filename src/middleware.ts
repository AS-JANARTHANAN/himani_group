import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, renewIfDue, verifySession } from "@/lib/session";

/** Guards the admin area and keeps active sessions alive (sliding expiry). */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const s = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) {
    if (isApi) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    const url = new URL("/admin/login", req.url);
    const res = NextResponse.redirect(url);
    if (req.cookies.has(SESSION_COOKIE)) res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
    return res;
  }
  const res = NextResponse.next();
  const fresh = await renewIfDue(s);
  if (fresh) res.cookies.set(SESSION_COOKIE, fresh, cookieOptions());
  return res;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
