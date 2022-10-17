import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId, username } = req.body;

  console.log("username", username);
  console.log("routeId", routeId);

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

  if (!route) {
    return res.status(404).send({
      error: "Route not found.",
    });
  }

  return res.status(200).send(route);
};

export default handler;
