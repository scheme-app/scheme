import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId }: { routeId?: string } = req.query;

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
      models: true,
      nestedModels: {
        include: {
          fields: true,
        },
      },
    },
  });

  if (!route) {
    return res.status(400).send({
      error: "Route does not exist.",
    });
  }

  return res.status(200).send(route);
};

export default handler;
