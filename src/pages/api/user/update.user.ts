import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, ...data } = req.body;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...data,
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
