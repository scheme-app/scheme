import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";

type RequestBody = {
  routeId: string;
  folderId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { routeId, folderId, ...data }: RequestBody = req.body;

    const route = await prisma.route.findUnique({
      where: {
        id: routeId,
      },
    });

    if (!route) {
      return res.status(400).send({
        error: "Route does not exist.",
      });
    }

    const updatedRoute = await prisma.route.update({
      where: {
        id: routeId,
      },
      data: {
        ...data,
        ...(folderId && {
          folder: {
            connect: {
              id: folderId,
            },
          },
        }),
      },
    });

    return res.status(200).send(updatedRoute);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
