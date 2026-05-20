import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    userAgent: String,
    expiresAt: { type: Date, required: true }
  },
  { _id: false }
);

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "admin" },
    sessions: [SessionSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
