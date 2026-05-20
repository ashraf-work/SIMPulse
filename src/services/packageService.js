import { connectDB } from "@/lib/db";
import { normalizeMongo, paginationMeta } from "@/lib/utils";
import ServicePackage from "@/models/ServicePackage";

export async function listPackages(query) {
  await connectDB();
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const filter = query.q
    ? { $or: [{ name: { $regex: query.q, $options: "i" } }, { packageId: { $regex: query.q, $options: "i" } }] }
    : {};

  const [items, totalCount] = await Promise.all([
    ServicePackage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ServicePackage.countDocuments(filter)
  ]);
  return { items: items.map(normalizeMongo), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createPackage(payload) {
  await connectDB();
  const created = await ServicePackage.create(payload);
  return normalizeMongo(created);
}

export async function deletePackage(id) {
  await connectDB();
  return ServicePackage.findByIdAndDelete(id);
}
