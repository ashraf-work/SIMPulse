import { connectDB } from "@/lib/db";
import { normalizeMongo, paginationMeta } from "@/lib/utils";
import Sim from "@/models/Sim";

function buildFilter({ q = "", network = "", scheme = "" }) {
  const filter = {};
  if (q) filter.simNumber = { $regex: q, $options: "i" };
  if (network) filter.networkChannel = { $regex: network, $options: "i" };
  if (scheme) filter.assignedScheme = { $regex: scheme, $options: "i" };
  return filter;
}

export async function listSims(query) {
  await connectDB();
  const filter = buildFilter(query);
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const [items, totalCount] = await Promise.all([
    Sim.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Sim.countDocuments(filter)
  ]);
  return { items: items.map(normalizeMongo), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createSim(payload) {
  await connectDB();
  const sim = await Sim.create(payload);
  return normalizeMongo(sim);
}

export async function bulkCreateSims(sims) {
  await connectDB();
  const result = await Sim.insertMany(sims, { ordered: false });
  return result.map(normalizeMongo);
}

export async function deleteSim(id) {
  await connectDB();
  return Sim.findByIdAndDelete(id);
}
