import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const session = await validateSession(req, res);
    // const session = await unstable_getServerSession(req, res, authOptions);

    // validateSession(session, res);

    // const session = validateSession(
    //   await unstable_getServerSession(req, res, authOptions),
    //   res
    // );

    const session = await unstable_getServerSession(req, res, authOptions);

    const projects = await prisma.user
      .findUnique({
        where: {
          id: session!.user.id,
        },
      })
      .projects({
        select: {
          id: true,
          name: true,
        },
      });

    return res.status(StatusCodes.OK).json(projects);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
