import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { origin, search } = request.nextUrl;
  const decodedPath = decodeURIComponent(request.nextUrl.pathname);

  if (decodedPath === "/shop-2") {
    const redirectUrl = new URL(`/${search}`, origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Match everything so you can decode and check
};
