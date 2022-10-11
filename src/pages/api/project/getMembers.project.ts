import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { projectId }: { projectId?: string } = req.query;

  if (!projectId) {
    return res.status(400).send({
      error: "You must provide a project id",
    });
  }

  const members = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      roles: {
        select: {
          type: true,
          users: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      // members: {
      //   select: {
      //     id: true,
      //     name: true,
      //     username: true,
      //     email: true,
      //     roles: {
      //       where: {
      //         projectId: projectId,
      //       },
      //       select: {
      //         type: true,
      //       },
      //     },
      //     // role: true,
      //   },
      // },
    },
  });

  res.json(members);
};

export default handler;
