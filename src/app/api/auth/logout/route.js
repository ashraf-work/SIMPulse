import { NextResponse } from "next/server";
import { cookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { verifySession } from "@/lib/jwt";
import { logoutAdmin } from "@/services/authService";

export async function POST(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      const payload = await verifySession(token);
      await logoutAdmin(payload.adminId, payload.sessionId);
    } catch {
      // Cookie is cleared below even if the stored session is already gone.
    }
  }
  const response = NextResponse.json({ success: true, message: "Logged out successfully", data: {} });
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
