import crypto from "crypto";
import { connectDB } from "@/lib/db";
import ActivationRequest from "@/models/ActivationRequest";
import Sim from "@/models/Sim";

function formatPublicRequest(request) {
  return {
    referenceId: request.requestId,
    simNumber: request.simNumber,
    status: request.status,
    source: request.provider,
    carrierName: request.carrierSnapshot?.carrierName,
    packageName: request.carrierSnapshot?.packageName,
    price: request.carrierSnapshot?.price,
    createdAt: request.createdAt
  };
}

function generateRequestId() {
  return `REQ-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

export async function createPublicActivation(payload) {
  await connectDB();
  const sim = await Sim.findOneAndUpdate(
    { simNumber: payload.simNumber, status: "available" },
    { status: "activated" },
    { returnDocument: "after" }
  ).select("_id simNumber status packageSnapshot");

  if (!sim) {
    const existing = await Sim.findOne({ simNumber: payload.simNumber }).select("status").lean();
    const error = new Error(existing ? "This SIM is already activated." : "Invalid SIM number.");
    error.statusCode = existing ? 409 : 404;
    throw error;
  }

  const request = await ActivationRequest.create({
    customerName: payload.customerName,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    simNumber: payload.simNumber,
    provider: payload.source,
    carrierSnapshot: {
      carrierName: sim.packageSnapshot?.carrierName,
      packageName: sim.packageSnapshot?.name,
      price: sim.packageSnapshot?.price
    },
    requestId: generateRequestId(),
    status: "pending"
  });
  return formatPublicRequest(request.toObject());
}

export async function checkPublicSim(simNumber) {
  await connectDB();
  const sim = await Sim.findOne({ simNumber }).select("simNumber status").lean();
  if (!sim) {
    const error = new Error("Invalid SIM number.");
    error.statusCode = 404;
    throw error;
  }
  if (sim.status === "activated") {
    const error = new Error("This SIM is already activated.");
    error.statusCode = 409;
    throw error;
  }
  return { simNumber: sim.simNumber, status: sim.status };
}

export async function findPublicStatus(query) {
  await connectDB();
  const request = await ActivationRequest.findOne({
    $or: [
      { requestId: { $regex: `^${escapeRegExp(query)}$`, $options: "i" } },
      { simNumber: query }
    ]
  })
    .select("simNumber provider carrierSnapshot requestId status createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return request ? formatPublicRequest(request) : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
