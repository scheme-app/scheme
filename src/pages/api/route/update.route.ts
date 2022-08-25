import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId, folderId, ...data } = req.body;

  if (!routeId) {
    return res.status(400).send({
      error: "Route id is required.",
    });
  }

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
};

export default handler;
