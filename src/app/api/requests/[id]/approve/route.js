import { errorResponse, successResponse } from "@/lib/utils";
import { updateRequestStatus } from "@/services/requestService";

export async function PATCH(_request, { params }) {
  const { id } = await params;
  const item = await updateRequestStatus(id, "approved");
  if (!item) return errorResponse("Request not found", 404);
  return successResponse(item, "Request approved");
}
