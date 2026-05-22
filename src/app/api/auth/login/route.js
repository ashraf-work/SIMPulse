import { cookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";
import { loginSchema } from "@/validations/admin";
import { loginAdmin } from "@/services/authService";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid login payload", 422, parsed.error.issues);
    console.log({body})

    const result = await loginAdmin({
      ...parsed.data,
      userAgent: request.headers.get("user-agent") || ""
    });

    if (!result) return errorResponse("Invalid email or password", 401);

    const response = successResponse({ admin: result.admin }, "Logged in successfully");
    response.cookies.set(SESSION_COOKIE, result.token, cookieOptions());
    return response;
  } catch {
    return errorResponse("Unable to login", 500);
  }
}
