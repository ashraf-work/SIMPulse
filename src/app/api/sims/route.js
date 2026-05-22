import { errorResponse, parseQuery, successResponse } from "@/lib/utils";
import { createSim, listSims } from "@/services/simService";
import { simQuerySchema, simSchema } from "@/validations/sim";

export async function GET(request) {
  const parsed = simQuerySchema.safeParse(parseQuery(request));
  if (!parsed.success) return errorResponse("Invalid query", 422, parsed.error.issues);
  return successResponse(await listSims(parsed.data), "SIM inventory loaded");
}

export async function POST(request) {
  try {
    const parsed = simSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Invalid SIM payload", 422, parsed.error.issues);
    return successResponse(await createSim(parsed.data), "SIM created");
  } catch (error) {
    if (error.code === 11000) return errorResponse("SIM number already exists.", 409);
    return errorResponse(error.message || "Unable to create SIM", error.statusCode || 400);
  }
}
