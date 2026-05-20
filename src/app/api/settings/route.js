import { errorResponse, successResponse } from "@/lib/utils";
import { getSettings, updateSettings } from "@/services/settingService";
import { settingSchema } from "@/validations/setting";

export async function GET() {
  return successResponse(await getSettings(), "Settings loaded");
}

export async function PUT(request) {
  const parsed = settingSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse("Invalid settings payload", 422, parsed.error.issues);
  return successResponse(await updateSettings(parsed.data), "Settings updated successfully");
}
