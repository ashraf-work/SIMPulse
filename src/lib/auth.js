import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifySession } from "@/lib/jwt";
import Admin from "@/models/Admin";

export const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "simpulse_session";

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = await verifySession(token);
    await connectDB();
    const admin = await Admin.findOne({
      _id: payload.adminId,
      "sessions.sessionId": payload.sessionId,
      "sessions.expiresAt": { $gt: new Date() }
    }).select("_id email name role createdAt");

    return admin;
  } catch {
    return null;
  }
}
