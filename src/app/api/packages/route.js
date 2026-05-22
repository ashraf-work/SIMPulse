import { errorResponse, parseQuery, successResponse } from "@/lib/utils";
import { createPackage, listPackages } from "@/services/packageService";
import { packageQuerySchema, packageSchema } from "@/validations/package";

export async function GET(request) {
  const parsed = packageQuerySchema.safeParse(parseQuery(request));
  if (!parsed.success) return errorResponse("Invalid query", 422, parsed.error.issues);
  return successResponse(await listPackages(parsed.data), "Packages loaded");
}

export async function POST(request) {
  try {
    const parsed = packageSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Invalid package payload", 422, parsed.error.issues);
    return successResponse(await createPackage(parsed.data), "Package created");
  } catch (error) {
    return errorResponse(error.code === 11000 ? "Package ID already exists" : "Unable to create package", error.code === 11000 ? 409 : 400);
  }
}
