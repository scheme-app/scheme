import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId }: { tokenId?: string } = req.query;

  const token = await prisma.token.findUnique({
    where: {
      id: tokenId,
    },
    select: {
      user: {
        select: {
          projects: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  folders: true,
                  routes: true,
                },
              },
              owner: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!token) {
    return res.status(400).send({
      error: "Token does not exist.",
    });
  }

  return res.status(200).send(token.user.projects);
};

export default handler;
