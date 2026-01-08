import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = [
          "/api/getJobs",
          "/api/getCompanyByID",
          "/api/getEntityById",
          "/api/getUserProfile",
          "/api/searchJobs",
          "/api/registerCredentialsUser",
          "/api/companyVerifyMagicLink", // Adding this based on file list as it's likely auth-related
        ];

        // Check if the current path is in the public routes list
        const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

        // If it's a public route or the user has a token, authorize
        return isPublicRoute || !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*"],
};
