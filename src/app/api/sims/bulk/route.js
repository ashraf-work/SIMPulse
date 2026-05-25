import { errorResponse, successResponse } from "@/lib/utils";
import { bulkCreateSims } from "@/services/simService";
import { bulkSimsSchema } from "@/validations/sim";

export async function POST(request) {
  try {
    const parsed = bulkSimsSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Invalid bulk SIM payload", 422, parsed.error.issues);
    return successResponse({ items: await bulkCreateSims(parsed.data.sims) }, "Bulk SIM upload completed");
  } catch (error) {
    const message = error.code === 11000
      ? "Bulk upload failed. Check for duplicate SIM numbers."
      : error.message || "Bulk upload failed.";
    return errorResponse(message, error.statusCode || 400);
  }
}
