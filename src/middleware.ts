import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret",
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";
  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/", request.nextUrl));
    } catch (err) {
      // Token invalid, continue to login
    }
  }

  if (!isPublicPath && !token) {
    // Exclude API routes from redirecting to login in middleware if needed,
    // but usually you want to protect everything except login
    if (!path.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  if (path === "/admin") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.nextUrl));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin", "/api/expenses/:path*", "/api/budget/:path*"],
};
