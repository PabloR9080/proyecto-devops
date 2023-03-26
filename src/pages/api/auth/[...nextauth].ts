import { User } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) return null;

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          // randomKey: "hi",
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log({ session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          // randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log({ token, user });
      if (user) {
        const u = user as unknown as User;
        return {
          ...token,
          id: user.id,
          // sale error en la línea de abajo porque el user no tiene randomKey en el schema
          // randomKey: user.randomKey,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export default handler;
// hay error con la sig linea
// export { handler as GET, handler as POST };
