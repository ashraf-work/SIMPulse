import { errorResponse, parseQuery, successResponse } from "@/lib/utils";
import { findPublicStatus } from "@/services/publicService";
import { publicStatusSchema } from "@/validations/public";

export async function GET(request) {
  const parsed = publicStatusSchema.safeParse(parseQuery(request));
  if (!parsed.success) return errorResponse("Invalid status query", 422, parsed.error.issues);

  const result = await findPublicStatus(parsed.data.query);
  if (!result) return errorResponse("No activation request found", 404);

  return successResponse(result, "Activation status fetched successfully");
}
