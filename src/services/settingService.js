import { connectDB } from "@/lib/db";
import { normalizeMongo } from "@/lib/utils";
import Setting from "@/models/Setting";

export async function getSettings() {
  await connectDB();
  const setting = await Setting.findOneAndUpdate(
    { singleton: "global" },
    { $setOnInsert: { singleton: "global" } },
    { upsert: true, new: true }
  );
  return normalizeMongo(setting);
}

export async function updateSettings(payload) {
  await connectDB();
  const setting = await Setting.findOneAndUpdate(
    { singleton: "global" },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return normalizeMongo(setting);
}
