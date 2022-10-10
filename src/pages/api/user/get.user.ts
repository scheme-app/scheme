import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, username } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      ...(userId && { id: userId as string }),
      ...(username && { username: username as string }),
    },
    select: {
      id: true,
      name: true,
      username: true,
      projects: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(400).send({
      error: "User not found",
    });
  }

  return res.status(200).send(user);
};

export default handler;
