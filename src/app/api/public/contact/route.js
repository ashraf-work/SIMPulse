import { errorResponse, successResponse } from "@/lib/utils";
import { createContactMessage } from "@/services/contactService";
import { contactSchema } from "@/validations/public";

export async function POST(request) {
  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse("Invalid contact payload", 422, parsed.error.issues);
    return successResponse(await createContactMessage(parsed.data), "Message submitted successfully");
  } catch {
    return errorResponse("Unable to submit contact message", 500);
  }
}
