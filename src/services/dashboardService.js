import { connectDB } from "@/lib/db";
import { normalizeMongo } from "@/lib/utils";
import ActivationRequest from "@/models/ActivationRequest";
import ServicePackage from "@/models/ServicePackage";
import Sim from "@/models/Sim";

export async function getDashboardStats() {
  await connectDB();
  const [totalSims, activatedSims, pendingRequests, totalRequests, totalPackages, recentRequests] =
    await Promise.all([
      Sim.countDocuments(),
      Sim.countDocuments({ status: "activated" }),
      ActivationRequest.countDocuments({ status: "pending" }),
      ActivationRequest.countDocuments(),
      ServicePackage.countDocuments(),
      ActivationRequest.find().sort({ createdAt: -1 }).limit(6)
    ]);

  return {
    stats: {
      totalSims,
      activatedSims,
      pendingRequests,
      totalRequests,
      totalPackages
    },
    recentRequests: recentRequests.map(normalizeMongo),
    infrastructure: [
      { label: "Activation API", status: "Operational", latency: "24ms" },
      { label: "SIM Registry", status: "Synced", latency: `${totalSims} records` },
      { label: "Network Gateway", status: "Stable", latency: "99.9%" }
    ]
  };
}
