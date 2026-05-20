import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: "global", unique: true },
    businessName: { type: String, default: "SIMPulse" },
    supportEmail: { type: String, default: "support@simpulse.net" },
    autoActivation: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
