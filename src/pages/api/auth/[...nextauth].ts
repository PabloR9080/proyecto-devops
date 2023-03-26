import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: 1, name: "John Doe", email: "john.doe@example.com" };
        return user;
      },
    }),
  ],
  // pages: {
  //   signIn: "/signin",
  // },
};

const handler = NextAuth(authOptions);
export default handler;
// hay error con la sig linea
// export { handler as GET, handler as POST };
