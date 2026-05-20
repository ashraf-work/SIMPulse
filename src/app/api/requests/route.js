import { errorResponse, parseQuery, successResponse } from "@/lib/utils";
import { createRequest, listRequests } from "@/services/requestService";
import { activationRequestSchema, requestQuerySchema } from "@/validations/request";

export async function GET(request) {
  const parsed = requestQuerySchema.safeParse(parseQuery(request));
  if (!parsed.success) return errorResponse("Invalid query", 422, parsed.error.issues);
  return successResponse(await listRequests(parsed.data), "Activation requests loaded");
}

export async function POST(request) {
  try {
    const parsed = activationRequestSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Invalid request payload", 422, parsed.error.issues);
    return successResponse(await createRequest(parsed.data), "Activation request created");
  } catch {
    return errorResponse("Unable to create activation request", 400);
  }
}
