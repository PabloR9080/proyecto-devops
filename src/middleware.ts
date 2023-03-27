// protege todas las rutas por default
// export { default } from "next-auth/middleware";

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// proteger rutas
// export const config = { matcher: ["/pages/:path"] };
