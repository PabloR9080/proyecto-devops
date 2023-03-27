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
export const config = { matcher: ["/"] };
// export const config = { matcher: ["/pages/:path"] };
