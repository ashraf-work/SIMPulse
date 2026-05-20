import { errorResponse, successResponse } from "@/lib/utils";
import { deletePackage } from "@/services/packageService";

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const deleted = await deletePackage(id);
  if (!deleted) return errorResponse("Package not found", 404);
  return successResponse({}, "Package deleted");
}
