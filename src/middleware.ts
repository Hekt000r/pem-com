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
          // "/api/getUserProfile", // Removed to prevent scraping (Issue #4)
          "/api/searchJobs",
          "/api/registerCredentialsUser",
          "/api/companyVerifyMagicLink", 
          "/api/registerCompany",
          "/api/getJobByID",
          "/api/getCompanyByJobID",
          "/api/getJobs",
          "/api/getJobsByCompanyID",
          "/api/finishCompanyRegistration"
        ];

        // Check if the current path is in the public routes list
        const isPublicRoute = publicRoutes.includes(pathname);

        // If it's a public route or the user has a token, authorize
        return isPublicRoute || !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*"],
};
