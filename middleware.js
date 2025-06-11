import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      if (pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }

      // For other protected routes, just check if logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile",
    "/appointments/:path*",
    "/messages/:path*",
  ],
}; 