import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

type ArgTypes = {
  routeId: string;
  authorization: "NONE" | "API_KEY" | "BEARER" | "BASIC" | "DIGEST" | "OAUTH";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId, authorization }: ArgTypes = req.body;

  if (!routeId) {
    return res.status(400).send({
      error: "Route id is required.",
    });
  }

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
      authorization: authorization,
    },
  });

  return res.status(200).json(updatedRoute);
};

export default handler;
