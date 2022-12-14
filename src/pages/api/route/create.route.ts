import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import type { RouteType, AuthorizationType } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

type RequestBody = {
  projectId: string;
  name: string;
  type: RouteType;
  authorization: AuthorizationType;
  folderId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = validateSession(
      await unstable_getServerSession(req, res, authOptions),
      res
    );

    const { projectId, name, type, authorization, folderId }: RequestBody =
      req.body;

    const roles = await prisma.user
      .findUnique({
        where: {
          id: session.user.id,
        },
      })
      .roles({
        where: {
          projectId: projectId,
        },
      });

    if (!roles) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "You are not a member of this project",
      });
    }

    const route = await prisma.route.findMany({
      where: {
        folderId: folderId,
        projectId: projectId,
        name: name,
      },
    });

    if (route.length > 0) {
      return res.status(409).send({
        error: "Route already exists here",
      });
    }

    const createdRoute = await prisma.route.create({
      data: {
        name: name,
        type: type,
        ...(folderId && {
          folder: {
            connect: {
              id: folderId,
            },
          },
        }),
        owner: {
          connect: {
            id: session.user.id,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
        models: {
          create: [
            { name: "Arguments", type: "PARENT" },
            { name: "Response", type: "PARENT" },
          ],
        },
        authorization: authorization || "NONE",
      },
      include: {
        models: true,
      },
    });

    return res.status(200).send(createdRoute);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
