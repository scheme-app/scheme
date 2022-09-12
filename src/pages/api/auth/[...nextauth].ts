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
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        console.log("next-aut user", user);
        token.type = user?.type;
        token.userId = token.sub;
        token.username = user?.username as string;
        token.onboarded = user?.onboarded as boolean;
      }

      return token;
    },
    session: async ({ session, token }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
        include: {
          projects: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }
      session.user = {
        id: token.sub!,
        username: token.username!,
        name: token.name!,
        email: token.email!,
        type: token.type! as "USER" | "ADMIN",
        projects: user!.projects,
        onboarded: token.onboarded!,
      };

      return session;
    },
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   if (user.onboarded === false) {
    //     return "/newUser";
    //   }

    //   return true;
    // },
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   console.log("userId", user.id);

    //   const userData = await prisma.user.findUnique({
    //     where: {
    //       id: user.id,
    //     },
    //     include: {
    //       projects: true,
    //     },
    //   });

    //   console.log("userData", userData);

    //   return true;
    // },
  },
};

export default NextAuth(authOptions);
