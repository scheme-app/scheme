import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, name, username, projectName } = req.body;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: name,
      username: username,
      projects: {
        create: {
          name: projectName,
        },
      },
      tokens: {
        create: {
          name: "Raycast",
        },
      },
      onboarded: true,
    },
  });

  if (!user) {
    return res.status(400).send({
      error: "User not updated",
    });
  }

  console.log("user", user);

  return res.status(200).send(user);
};

export default handler;
