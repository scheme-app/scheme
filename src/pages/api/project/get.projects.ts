import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const { tokenId }: { tokenId?: string } = req.query;

  if (!tokenId && !session) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  let projects = [];

  if (tokenId) {
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

    projects = token?.user.projects as any;
  }

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
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
    });

    projects = user?.projects as any;
  }

  return res.status(200).send(projects);
};

export default handler;
