import { connectDB } from "@/lib/db";
import { paginationMeta } from "@/lib/utils";
import Sim from "@/models/Sim";
import ServicePackage from "@/models/ServicePackage";

function formatSim(sim) {
  return {
    _id: String(sim._id),
    simNumber: sim.simNumber,
    packageId: sim.packageSnapshot?.packageId || "UNASSIGNED",
    packageName: sim.packageSnapshot?.name || "Unassigned Package",
    dataLimit: sim.packageSnapshot?.dataLimit || "-",
    price: sim.packageSnapshot?.price || 0,
    status: sim.status,
    createdAt: sim.createdAt
  };
}

function buildFilter({ q = "", packageId = "", status = "all" }) {
  const filter = {};
  if (q) filter.simNumber = { $regex: q, $options: "i" };
  if (packageId) filter["packageSnapshot.packageId"] = packageId;
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
      .select("simNumber packageSnapshot status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Sim.countDocuments(filter)
  ]);
  return { items: items.map(formatSim), pagination: paginationMeta({ page, limit, totalCount }) };
}

export async function createSim({ simNumber, packageId }) {
  await connectDB();
  const [duplicate, servicePackage] = await Promise.all([
    Sim.exists({ simNumber }),
    ServicePackage.findOne({ packageId }).select("_id packageId name dataLimit price").lean()
  ]);
  if (duplicate) {
    const error = new Error("SIM number already exists");
    error.statusCode = 409;
    throw error;
  }
  if (!servicePackage) {
    const error = new Error("Selected package was not found");
    error.statusCode = 404;
    throw error;
  }
  const sim = await Sim.create({
    simNumber,
    package: servicePackage._id,
    packageSnapshot: {
      packageId: servicePackage.packageId,
      name: servicePackage.name,
      dataLimit: servicePackage.dataLimit,
      price: servicePackage.price
    },
    status: "available"
  });
  return formatSim(sim.toObject());
}

export async function bulkCreateSims(sims) {
  await connectDB();
  const packageIds = [...new Set(sims.map((sim) => sim.packageId))];
  const packages = await ServicePackage.find({ packageId: { $in: packageIds } })
    .select("_id packageId name dataLimit price")
    .lean();
  const packageMap = new Map(packages.map((item) => [item.packageId, item]));
  const payload = sims.map((sim) => {
    const servicePackage = packageMap.get(sim.packageId);
    if (!servicePackage) throw new Error(`Package not found: ${sim.packageId}`);
    return {
      simNumber: sim.simNumber,
      package: servicePackage._id,
      packageSnapshot: {
        packageId: servicePackage.packageId,
        name: servicePackage.name,
        dataLimit: servicePackage.dataLimit,
        price: servicePackage.price
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
