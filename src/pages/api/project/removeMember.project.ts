import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, projectId }: { username: string; projectId: string } =
    req.body;

  const roles = await prisma.role.findMany({
    where: {
      projectId: projectId,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!roles) {
    return res.status(400).send({
      error: "Project roles not found",
    });
  }

  const user = await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      projects: {
        disconnect: { id: projectId },
      },
      roles: {
        disconnect: [
          { id: roles[0]!.id },
          { id: roles[1]!.id },
          { id: roles[2]!.id },
        ],
      },
    },
  });

  if (!user) {
    return res.status(500).send({
      error: "Internal server error",
    });
  }

  return res.status(200).send(user);
};

export default handler;
