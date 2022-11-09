//Next
import { NextApiRequest, NextApiResponse } from "next";

//Prisma
// import { prisma } from "@utils/prisma";
import { prisma, handleError } from "@utils";

//Types
import type { RouteType, AuthorizationType } from "@prisma/client";

//Auth
import { unstable_getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]";
import { authOptions } from "@auth/[...nextauth]";

// HTTP error codes
import { ReasonPhrases, StatusCodes } from "http-status-codes";

type RequestBody = {
  projectId: string;
  name: string;
  type: RouteType;
  authorization: AuthorizationType;
  folderId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: ReasonPhrases.UNAUTHORIZED,
    });
  }

  const userId = session.user.id;

  const { projectId, name, type, authorization, folderId }: RequestBody =
    req.body;

  try {
    const roles = await prisma.user
      .findUnique({
        where: {
          id: userId,
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
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
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
  } catch (error) {
    // return res.status(400).json(e); // call some generic function for handling errors to diffrentiate between server error and prisma error
    handleError(error, res);
  }

  try {
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
            id: userId,
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
    // return res.status(400).json(e); // call some generic function for handling errors to diffrentiate between server error and prisma error
    handleError(error, res);
  }
};

export default handler;
