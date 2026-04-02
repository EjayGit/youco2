import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

//clerkMiddleware will have a list of routes that are protected --> this is the only custom part
const isProtectedRoute = createRouteMatcher(["/profile","/quiz"]);

//clerkMiddleware will compare the route from the list and the current route the user is navigating to --> if the current route matches one from the list, it will trigger auth check
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};