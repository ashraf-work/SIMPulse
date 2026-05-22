import { connectDB } from "@/lib/db";
import { paginationMeta } from "@/lib/utils";
import ActivationRequest from "@/models/ActivationRequest";
import Sim from "@/models/Sim";

function formatRequest(item) {
  return {
    _id: String(item._id),
    customerName: item.customerName,
    email: item.email,
    phone: item.phone,
    simNumber: item.simNumber,
    provider: item.provider,
    requestId: item.requestId,
    status: item.status,
    createdAt: item.createdAt
  };
}

export async function listRequests(query) {
  await connectDB();
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const filter = query.status && query.status !== "all" ? { status: query.status } : {};
  const [items, totalCount] = await Promise.all([
    ActivationRequest.find(filter)
      .select("customerName email phone simNumber provider requestId status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ActivationRequest.countDocuments(filter)
  ]);
  return { items: items.map(formatRequest), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createRequest(payload) {
  await connectDB();
  const created = await ActivationRequest.create(payload);
  return formatRequest(created.toObject());
}

export async function updateRequestStatus(id, status) {
  await connectDB();
  const request = await ActivationRequest.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
  if (request && status === "activated") {
    await Sim.updateOne({ simNumber: request.simNumber }, { status: "activated" });
  }
  return request ? formatRequest(request.toObject()) : null;
}
