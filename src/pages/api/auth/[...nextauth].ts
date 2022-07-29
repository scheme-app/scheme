import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../utils/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.type = user?.type;
      }

      return token;
    },
    session: async ({ session, user, token }) => {
      console.log("session", session);
      console.log("token", token);

      session.user = {
        id: token.sub!,
        name: token.name!,
        email: token.email!,
        type: token.type! as "USER" | "ADMIN",
      };

      return session;
    },
  },
};

export default NextAuth(authOptions);
