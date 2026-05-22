import { connectDB } from "@/lib/db";
import { paginationMeta } from "@/lib/utils";
import ServicePackage from "@/models/ServicePackage";

function formatPackage(item) {
  return {
    _id: String(item._id),
    packageId: item.packageId,
    name: item.name,
    dataLimit: item.dataLimit,
    price: item.price,
    createdAt: item.createdAt
  };
}

export async function listPackages(query) {
  await connectDB();
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const filter = query.q
    ? { $or: [{ name: { $regex: query.q, $options: "i" } }, { packageId: { $regex: query.q, $options: "i" } }] }
    : {};

  const [items, totalCount] = await Promise.all([
    ServicePackage.find(filter)
      .select("packageId name dataLimit price createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ServicePackage.countDocuments(filter)
  ]);
  return { items: items.map(formatPackage), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createPackage(payload) {
  await connectDB();
  const created = await ServicePackage.create(payload);
  return formatPackage(created.toObject());
}

export async function deletePackage(id) {
  await connectDB();
  return ServicePackage.findByIdAndDelete(id);
}
