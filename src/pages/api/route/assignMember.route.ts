import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";

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
          connect: {
            username: username,
          },
        },
      },
    });

    return res.status(200).send(route);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
