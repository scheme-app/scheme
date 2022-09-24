import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

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
