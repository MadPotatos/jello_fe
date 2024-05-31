import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkMembership } from "./app/api/memberApi";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const localeResponse = intlMiddleware(request);

  if (localeResponse?.ok) {
    const { pathname } = request.nextUrl;
    const pathSegments = pathname.split("/").filter(Boolean);

    const locale = ["en", "vi"].includes(pathSegments[0])
      ? pathSegments[0]
      : "en";
    const segmentOffset = ["en", "vi"].includes(pathSegments[0]) ? 1 : 0;

    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userId: number | undefined = session?.user?.id;

    if (pathSegments[segmentOffset] === "projects") {
      if (!userId) {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/login`, request.url)
        );
      }

      if (pathSegments[segmentOffset + 1] === "detail") {
        const projectId = parseInt(pathSegments[segmentOffset + 2], 10);

        if (userId && projectId) {
          try {
            const isMember = await checkMembership(projectId, userId);

            if (!isMember) {
              return NextResponse.redirect(
                new URL(`/${locale}/not-member`, request.url)
              );
            }
          } catch (error) {
            console.error("Error checking membership:", error);
            return NextResponse.redirect(
              new URL(`/${locale}/error`, request.url)
            );
          }
        } else {
          return NextResponse.redirect(
            new URL(`/${locale}/error`, request.url)
          );
        }
      }
    }

    return localeResponse;
  }

  return localeResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/"],
};
