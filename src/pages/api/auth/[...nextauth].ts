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
    strategy: "database",
  },
  pages: {
    // signIn: "/login",
    // newUser: "/newUser",
  },
  callbacks: {
    //JWT sessions not used because of prisma DB adapter
    // jwt: async ({ token, user }) => {
    //   if (user) {
    //     token.type = user?.type;
    //     token.userId = token.sub;
    //     token.username = user?.username as string;
    //     token.onboarded = user?.onboarded as boolean;
    //   }

    //   return token;
    // },
    session: async ({ session, user }) => {
      // const user = await prisma.user.findUnique({
      //   where: {
      //     id: token.sub,
      //   },
      //   include: {
      //     projects: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //   },
      // });

      // if (!user) {
      //   throw new Error("User not found");
      // }

      // session.user = {
      //   id: token.sub!,
      //   username: token.username!,
      //   name: token.name!,
      //   email: token.email!,
      //   type: token.type! as "USER" | "ADMIN",
      //   // projects: user!.projects,
      //   onboarded: token.onboarded!,
      // };
      session.user = {
        id: user.id,
        username: user.username as string | null,
        name: (user.name as string) || "",
        email: user.email as string,
        type: user.type as "USER" | "ADMIN",
        onboarded: user.onboarded as boolean,
      };

      return session;
    },
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   if (user.onboarded) {
    //     return true;
    //   }

    //   return "/newUser";
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
