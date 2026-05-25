import { connectDB } from "@/lib/db";
import { paginationMeta } from "@/lib/utils";
import Sim from "@/models/Sim";
import ServicePackage from "@/models/ServicePackage";

function formatSim(sim) {
  const snapshot = sim.packageSnapshot || {};
  return {
    _id: String(sim._id),
    simNumber: sim.simNumber,
    carrierId: String(sim.package?._id || sim.package || ""),
    carrierName: snapshot.carrierName || snapshot.packageId || "Unassigned Carrier",
    packageName: snapshot.name || "Unassigned Package",
    price: snapshot.price || 0,
    status: sim.status,
    createdAt: sim.createdAt
  };
}

function buildFilter({ q = "", carrierId = "", status = "all" }) {
  const filter = {};
  if (q) filter.simNumber = { $regex: q, $options: "i" };
  if (carrierId) filter.package = carrierId;
  if (status !== "all") filter.status = status;
  return filter;
}

export async function listSims(query) {
  await connectDB();
  const filter = buildFilter(query);
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const [items, totalCount] = await Promise.all([
    Sim.find(filter)
      .select("simNumber package packageSnapshot status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Sim.countDocuments(filter)
  ]);
  return { items: items.map(formatSim), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createSim({ simNumber, carrierId }) {
  await connectDB();
  const [duplicate, carrier] = await Promise.all([
    Sim.exists({ simNumber }),
    ServicePackage.findById(carrierId).select("_id carrierName name price").lean()
  ]);
  if (duplicate) {
    const error = new Error("SIM number already exists.");
    error.statusCode = 409;
    throw error;
  }
  if (!carrier) {
    const error = new Error("Selected carrier was not found");
    error.statusCode = 404;
    throw error;
  }
  const sim = await Sim.create({
    simNumber,
    package: carrier._id,
    packageSnapshot: {
      carrierName: carrier.carrierName,
      name: carrier.name,
      price: carrier.price
    },
    status: "available"
  });
  return formatSim(sim.toObject());
}

export async function bulkCreateSims(sims) {
  await connectDB();
  const carrierNames = [
    ...new Set(sims.map((sim) => sim.carrierName.trim()).filter(Boolean))
  ];
  const carriers = await ServicePackage.find({
    carrierName: { $in: carrierNames.map((name) => new RegExp(`^${escapeRegExp(name)}$`, "i")) }
  })
    .select("_id carrierName name price")
    .lean();

  const carrierMap = new Map();
  for (const carrier of carriers) {
    const key = carrier.carrierName.toLowerCase();
    if (carrierMap.has(key)) {
      throw new Error(`Multiple carriers found with name: ${carrier.carrierName}`);
    }
    carrierMap.set(key, carrier);
  }

  const payload = sims.map((sim) => {
    const carrier = carrierMap.get(sim.carrierName.trim().toLowerCase());
    if (!carrier) throw new Error(`Carrier not found: ${sim.carrierName}`);
    return {
      simNumber: sim.simNumber,
      package: carrier._id,
      packageSnapshot: {
        carrierName: carrier.carrierName,
        name: carrier.name,
        price: carrier.price
      },
      status: "available"
    };
  });
  const result = await Sim.insertMany(payload, { ordered: false });
  return result.map((item) => formatSim(item.toObject()));
}

export async function deleteSim(id) {
  await connectDB();
  return Sim.findByIdAndDelete(id);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
