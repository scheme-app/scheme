import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";
import { StatusCodes } from "http-status-codes";

type RequestBody = {
  routeId: string;
  username: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { routeId, username }: RequestBody = req.body;

    const route = await prisma.route.update({
      where: {
        id: routeId,
      },
      data: {
        assignedTo: {
          disconnect: {
            username: username,
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
