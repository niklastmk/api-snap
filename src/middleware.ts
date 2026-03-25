import { NextRequest, NextResponse } from "next/server";

const SNAPQR_HOSTNAMES = ["snapqr.app", "www.snapqr.app", "qr.api-snap.com", "www.qr.api-snap.com"];

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host")?.split(":")[0] ?? "";
  const pathname = req.nextUrl.pathname;

  // SnapQR hostname routing: rewrite snapqr.app requests to internal /snapqr/ paths
  if (SNAPQR_HOSTNAMES.includes(hostname)) {
    // API routes: rewrite /api/generate → /api/snapqr/generate, etc.
    if (pathname === "/api/generate") {
      return NextResponse.rewrite(new URL("/api/snapqr/generate", req.url));
    }
    if (pathname.startsWith("/api/qr/")) {
      return NextResponse.rewrite(
        new URL(pathname.replace("/api/qr/", "/api/snapqr/qr/"), req.url)
      );
    }
    if (pathname === "/api/checkout") {
      return NextResponse.rewrite(new URL("/api/snapqr/checkout", req.url));
    }
    // /r/[code] and /s/[code] are shared routes — no rewrite needed
    if (pathname.startsWith("/r/") || pathname.startsWith("/s/")) {
      return NextResponse.next();
    }
    // Upgrade pages
    if (pathname === "/upgrade/success") {
      return NextResponse.rewrite(new URL("/snapqr/upgrade/success", req.url));
    }
    if (pathname === "/upgrade") {
      return NextResponse.rewrite(new URL("/snapqr/upgrade", req.url));
    }
    // Home page
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/snapqr", req.url));
    }
  }

  // CORS for API routes
  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(corsHeaders())) {
      response.headers.set(key, value);
    }
    return response;
  }

  return NextResponse.next();
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

export const config = {
  matcher: ["/api/:path*", "/r/:path*", "/s/:path*", "/", "/upgrade", "/upgrade/:path*"],
};
