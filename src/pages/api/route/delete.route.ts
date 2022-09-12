import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId } = req.body;

  const route = await prisma.route.delete({
    where: {
      id: routeId,
    },
  });

  if (!route) {
    return res.status(400).send({
      error: "Route does not exist.",
    });
  }

  res.status(200).json(route);
};

export default handler;
