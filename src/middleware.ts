import { authMiddleware } from "@clerk/nextjs/server";

// Use authMiddleware here and declare publicRoutes to match app pages that
// don't require auth. Keeping matcher broad so Clerk runs for pages and api.
export default authMiddleware({
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
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)",
  ],
};
