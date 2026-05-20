import { getDashboardStats } from "@/services/dashboardService";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET() {
  try {
    return successResponse(await getDashboardStats(), "Dashboard loaded");
  } catch {
    return errorResponse("Unable to load dashboard", 500);
  }
}
