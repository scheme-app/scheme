import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

type RequestBody = {
  routeId: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = validateSession(
      await unstable_getServerSession(req, res, authOptions),
      res
    );

    const { routeId }: RequestBody = req.body;

    const project = await prisma.route
      .findUniqueOrThrow({
        where: {
          id: routeId,
        },
      })
      .project({
        select: {
          id: true,
        },
      });

    const roles = await prisma.user
      .findUnique({
        where: {
          id: session.user.id,
        },
      })
      .roles({
        where: {
          projectId: project.id,
        },
      });

    if (!roles) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "You are not a member of this project",
      });
    }

    const route = await prisma.route.delete({
      where: {
        id: routeId,
      },
    });

    res.status(StatusCodes.OK).json(route);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
