import { connectDB } from "@/lib/db";
import { normalizeMongo, paginationMeta } from "@/lib/utils";
import ActivationRequest from "@/models/ActivationRequest";
import Sim from "@/models/Sim";

export async function listRequests(query) {
  await connectDB();
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const filter = query.status && query.status !== "all" ? { status: query.status } : {};
  const [items, totalCount] = await Promise.all([
    ActivationRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ActivationRequest.countDocuments(filter)
  ]);
  return { items: items.map(normalizeMongo), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createRequest(payload) {
  await connectDB();
  const created = await ActivationRequest.create(payload);
  return normalizeMongo(created);
}

export async function updateRequestStatus(id, status) {
  await connectDB();
  const request = await ActivationRequest.findByIdAndUpdate(id, { status }, { new: true });
  if (request && status === "activated") {
    await Sim.updateOne({ simNumber: request.simNumber }, { status: "activated" });
  }
  return normalizeMongo(request);
}
