import { errorResponse, successResponse } from "@/lib/utils";
import { createPublicActivation } from "@/services/publicService";
import { publicActivationSchema } from "@/validations/public";

export async function POST(request) {
  try {
    const parsed = publicActivationSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Invalid activation payload", 422, parsed.error.issues);
    return successResponse(
      await createPublicActivation(parsed.data),
      "Activation request submitted successfully"
    );
  } catch (error) {
    return errorResponse(error.message || "Unable to submit activation request", error.statusCode || 500);
  }
}
