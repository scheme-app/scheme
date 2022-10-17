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
    select: {
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
};

export default handler;
