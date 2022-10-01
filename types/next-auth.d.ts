import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username: string | null;
      name: string;
      email: string;
      type: "USER" | "ADMIN";
      // projects: Array<{
      //   id: string;
      //   name: string;
      // }>;
      onboarded: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    userId?: string;
    username?: string;
    onboarded: boolean;
  }
}
