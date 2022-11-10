import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";

type RequestQuery = {
  userId?: string;
  username?: string;
  projectId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await validateSession(req, res);

    const { userId, username, projectId }: RequestQuery = req.query;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        ...(userId && { id: userId }),
        ...(username && { username: username }),
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

    if (
      projectId &&
      !user.projects.some((project) => project.id === projectId)
    ) {
      return res.status(400).send({
        error: "User not in project. Add to project before adding to route.",
      });
    }

    return res.status(200).send(user);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
