import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await validateSession(req, res);

    const projects = await prisma.user
      .findUnique({
        where: {
          id: session.user.id,
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
