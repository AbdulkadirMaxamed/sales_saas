import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/login", "/sign-up"]);

export default clerkMiddleware(async (auth, req) => {
  // Handle Supabase auth
  let supabaseResponse = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Important: Do not remove this - it refreshes the Supabase session
  await supabase.auth.getUser();

  // Handle Clerk auth
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return supabaseResponse;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
