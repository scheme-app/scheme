import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";

type RequestBody = {
  username: string;
  projectId: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await validateSession(req, res);
    const { username, projectId }: RequestBody = req.body;

    const roleWeight = {
      OWNER: 2,
      ADMIN: 1,
      MEMBER: 0,
    };

    const roles = await prisma.role.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        id: true,
        type: true,
        users: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });

    const meRole = roles.find((role) => {
      return role.users.some((user) => user.id === session.user.id);
    });

    const userRole = roles.find((role) => {
      return role.users.some((user) => user.username === username);
    });

    if (!meRole || !userRole) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Role not found",
      });
    }

    if (roleWeight[meRole.type] <= roleWeight[userRole.type]) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "You can't remove this user",
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
          disconnect: roles.map((role) => ({ id: role.id })),
        },
      },
    });

    return res.status(200).send(user);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
