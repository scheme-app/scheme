import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

type RequestBody = {
  username: string;
  projectId: string;
  type: "MEMBER" | "ADMIN";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { username, projectId, type }: RequestBody = req.body;

    // const session = await unstable_getServerSession(req, res, authOptions);

    // validateSession(session, res);

    const session = validateSession(
      await unstable_getServerSession(req, res, authOptions),
      res
    );

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

    //user cannot add member and adming can only add members not admins
    if (
      user.roles[0]!.type == "MEMBER" ||
      (user.roles[0]!.type == "ADMIN" && type == "ADMIN")
    ) {
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
