// protege todas las rutas por default
// export { default } from "next-auth/middleware";

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/register",
    signOut: "/login",
  },
});

// proteger rutas
export const config = {
  matcher: [
    "/",
    "/api/accounts/:path*",
    "/api/budgets/:path*",
    "/api/cards/:path*",
    "/api/transactions/:path*",
    "/api/users/:path*",
    "/api/hello",
  ],
};
// export const config = { matcher: ["/pages/:path"] };
