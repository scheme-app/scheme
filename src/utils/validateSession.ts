import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@auth/[...nextauth]";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const validateSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: ReasonPhrases.UNAUTHORIZED,
    });
  }

  if (session.user.onboarded == false) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: "You must complete the onboarding process before using the app.",
    });
  }

  return session;
};

export { validateSession };
