import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

type RequestQuery = {
  routeId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const session = validateSession(req, res);

    const session = validateSession(
      await unstable_getServerSession(req, res, authOptions),
      res
    );

    const { routeId }: RequestQuery = req.query;

    const route = await prisma.route.findUnique({
      where: {
        id: routeId,
      },
      include: {
        models: {
          include: {
            fields: {
              include: { models: true },
            },
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return res.status(StatusCodes.OK).send(route);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
