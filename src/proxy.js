import { NextResponse } from "next/server";
import { verifySession } from "@/lib/jwt";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "simpulse_session";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (pathname.startsWith("/admin/login")) return response;

  const protectsAdminPage = pathname.startsWith("/admin");
  const protectsApi = pathname.startsWith("/api") && !pathname.startsWith("/api/auth/login");

  if (!protectsAdminPage && !protectsApi) return response;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    if (protectsApi) {
      return NextResponse.json({ success: false, message: "Unauthorized", errors: [] }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await verifySession(token);
    return response;
  } catch {
    if (protectsApi) {
      return NextResponse.json({ success: false, message: "Invalid session", errors: [] }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"]
};
