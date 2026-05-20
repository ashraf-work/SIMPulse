import { errorResponse, successResponse } from "@/lib/utils";
import { deleteSim } from "@/services/simService";

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const deleted = await deleteSim(id);
  if (!deleted) return errorResponse("SIM not found", 404);
  return successResponse({}, "SIM deleted");
}
