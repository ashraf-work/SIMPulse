import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { signSession } from "@/lib/jwt";
import Admin from "@/models/Admin";

export async function loginAdmin({ email, password, userAgent }) {
  await connectDB();
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await signSession({ adminId: String(admin._id), sessionId, role: admin.role });
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  admin.sessions.push({ sessionId, tokenHash, userAgent, expiresAt });
  await admin.save();

  return {
    token,
    admin: {
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  };
}

export async function logoutAdmin(adminId, sessionId) {
  await connectDB();
  await Admin.updateOne({ _id: adminId }, { $pull: { sessions: { sessionId } } });
}
