import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

function formatSettings(setting) {
  return {
    _id: String(setting._id),
    businessName: setting.businessName,
    supportEmail: setting.supportEmail,
    autoActivation: setting.autoActivation,
    maintenanceMode: setting.maintenanceMode,
    updatedAt: setting.updatedAt
  };
}

export async function getSettings() {
  await connectDB();
  let setting = await Setting.findOne({ singleton: "global" })
    .select("businessName supportEmail autoActivation maintenanceMode updatedAt");
  if (!setting) {
    setting = await Setting.create({ singleton: "global" });
  }
  return formatSettings(setting);
}

export async function updateSettings(payload) {
  await connectDB();
  const setting = await Setting.findOneAndUpdate(
    { singleton: "global" },
    payload,
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).select("businessName supportEmail autoActivation maintenanceMode updatedAt");
  return formatSettings(setting);
}
