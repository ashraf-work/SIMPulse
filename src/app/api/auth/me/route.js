import { getCurrentAdmin } from "@/lib/auth";
import { errorResponse, normalizeMongo, successResponse } from "@/lib/utils";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return errorResponse("Unauthorized", 401);
  return successResponse({ admin: normalizeMongo(admin) }, "Current admin loaded");
}
