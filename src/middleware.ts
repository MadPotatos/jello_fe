import { NextRequest, NextResponse } from "next/server";
import { Backend_URL } from "./lib/Constants";
import { getToken } from "next-auth/jwt";
import { checkMembership } from "./app/api/memberApi";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split("/");

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const userId: number | undefined = session?.user?.id;

  if (pathSegments[1] === "projects") {
    if (!userId) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
  }
  if (pathSegments[1] === "projects" && pathSegments[2] === "detail") {
    const projectId = parseInt(pathSegments[3], 10);

    if (userId && projectId) {
      try {
        const isMember = await checkMembership(projectId, userId);

        if (!isMember) {
          return NextResponse.redirect(new URL("/not-member", request.url));
        }
      } catch (error) {
        console.error("Error checking membership:", error);
        return NextResponse.redirect(new URL("/error", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*", "/projects/detail/:projectId/:path*"],
};
