import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";

type RequestBody = {
  username: string;
  projectId: string;
  type: "MEMBER" | "ADMIN";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, projectId, type }: RequestBody = req.body;

  const session = await validateSession(req, res);

  try {
    const roles = await prisma.role.findMany({
      where: { projectId: projectId },
    });

    if (!roles) {
      return res.status(StatusCodes.NOT_FOUND).send({
        error: "Project roles not found",
      });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: session.user.id,
      },
      select: {
        roles: {
          where: {
            projectId: projectId,
          },
        },
      },
    });

    if (user.roles.length == 0) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        error: "You are not a member of this project.",
      });
    }

    if (user.roles[0]!.type == "MEMBER" && type == "ADMIN") {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        error: "You are not authorized to add an admin to this project.",
      });
    }

    const role = roles.find((role) => role.type == type)!.id;

    const updatedUser = await prisma.user.update({
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

    return res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
