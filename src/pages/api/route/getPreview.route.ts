import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";

type RequestQuery = {
  routeId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await validateSession(req, res);

    const { routeId }: RequestQuery = req.query;

    const route = await prisma.route.findUnique({
      where: {
        id: routeId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(route);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
