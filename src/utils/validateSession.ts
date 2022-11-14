import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@auth/[...nextauth]";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Session } from "next-auth";

const validateSession = (
  session: Session | null,
  res: NextApiResponse
): Session => {
  // const session: Session | null = await unstable_getServerSession(
  //   req,
  //   res,
  //   authOptions
  // );

  if (!session) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: ReasonPhrases.UNAUTHORIZED,
    }) as unknown as Session;
  }

  if (session.user.onboarded == false) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: "You must complete the onboarding process before using the app.",
    }) as unknown as Session;
  }

  return session;
};

export { validateSession };
