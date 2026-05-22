import { errorResponse, parseQuery, successResponse } from "@/lib/utils";
import { checkPublicSim } from "@/services/publicService";
import { startActivationSchema } from "@/validations/public";

export async function GET(request) {
  try {
    const parsed = startActivationSchema.safeParse(parseQuery(request));
    if (!parsed.success) return errorResponse("Invalid SIM number", 422, parsed.error.issues);
    return successResponse(await checkPublicSim(parsed.data.simNumber), "SIM is available");
  } catch (error) {
    return errorResponse(error.message || "Unable to verify SIM", error.statusCode || 500);
  }
}
