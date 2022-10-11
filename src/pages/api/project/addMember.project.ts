import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    username,
    projectId,
    type,
  }: { username: string; projectId: string; type: "MEMBER" | "ADMIN" } =
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

  const role = type === "ADMIN" ? roles[1]!.id : roles[2]!.id;

  const user = await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      projects: {
        connect: {
          id: projectId,
        },
      },
      roles: {
        connect: {
          id: role,
        },
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
