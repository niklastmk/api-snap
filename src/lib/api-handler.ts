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

    const { allowed, usage, limit } = await checkRateLimit(
      auth.apiKey.id,
      auth.user.plan,
      endpoint
    );

    if (!allowed) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";
      const now = new Date();
      const resetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
      const isPaidPlan = auth.user.plan !== "free";
      const upgradeUrl = isPaidPlan
        ? `${appUrl}/dashboard/billing`
        : `${appUrl}/pricing`;

      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: isPaidPlan
            ? `You've hit your ${auth.user.plan} plan limit of ${limit.toLocaleString()} requests this month. Upgrade to a higher tier for more capacity: ${upgradeUrl}`
            : `You've hit your free tier limit. Upgrade to Hobby ($9/mo) for 5,000 calls at ${appUrl}/pricing`,
          usage,
          limit,
          reset_at: resetAt,
          upgrade_url: upgradeUrl,
          docs_url: `${appUrl}/docs`,
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
