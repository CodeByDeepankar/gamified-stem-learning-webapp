import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Public pages that don't require auth
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/onboarding(.*)",
    "/offline(.*)",
    "/api/public(.*)",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\.[\w]+$|_next).*)",
    "/(api|trpc)(.*)",
  ],
};

