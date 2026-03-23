import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "./auth";
import { checkRateLimit } from "./rate-limit";

export function createApiHandler(
  endpoint: string,
  handler: (
    req: NextRequest,
    params: { userId: string; apiKeyId: string }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    // Extract API key from header or query
    const authHeader = req.headers.get("authorization");
    const apiKey =
      authHeader?.replace("Bearer ", "") ||
      req.nextUrl.searchParams.get("api_key");

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key required. Pass via Authorization: Bearer <key> header or ?api_key= query param.",
        },
        { status: 401 }
      );
    }

    const auth = await authenticateApiKey(apiKey);
    if (!auth) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    const { allowed, usage, limit } = checkRateLimit(
      auth.apiKey.id,
      auth.user.plan,
      endpoint
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          usage,
          limit,
          upgrade_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/pricing`,
        },
        { status: 429 }
      );
    }

    const response = await handler(req, {
      userId: auth.user.id,
      apiKeyId: auth.apiKey.id,
    });

    response.headers.set("X-RateLimit-Limit", String(limit));
    response.headers.set("X-RateLimit-Remaining", String(limit - usage));

    return response;
  };
}
