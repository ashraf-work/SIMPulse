import { connectDB } from "@/lib/db";
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
      ActivationRequest.find()
        .select("customerName email simNumber provider carrierSnapshot.price status createdAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean()
    ]);
    console.log({recentRequests});

  return {
    stats: {
      totalSims,
      activatedSims,
      pendingRequests,
      totalRequests,
      totalPackages
    },
    recentRequests: recentRequests.map((item) => ({
      _id: String(item._id),
      customerName: item.customerName,
      email: item.email,
      simNumber: item.simNumber,
      provider: item.provider,
      price: item.carrierSnapshot.price,
      status: item.status,
      createdAt: item.createdAt
    })),
    infrastructure: [
      { label: "Activation API", status: "Operational", latency: "24ms" },
      { label: "SIM Registry", status: "Synced", latency: `${totalSims} records` },
      { label: "Network Gateway", status: "Stable", latency: "99.9%" }
    ]
  };
}
