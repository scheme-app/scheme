import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
// import { getToken } from "next-auth/jwt";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { AuthorizationType } from "@prisma/client";
import { z } from "zod";

const ArgTypes = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1).max(255),
  type: z.enum(["GET", "POST"]),
  authorization: z
    .enum(["NONE", "API_KEY", "BEARER", "BASIC", "DIGEST", "OAUTH"])
    .optional()
    .default("NONE"),
  folderId: z.string().cuid().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const token = await getToken({ req });
  const session = await unstable_getServerSession(req, res, authOptions);
  const { integrationToken } = req.body;

  // if (!token && !integrationToken) {
  if (!session && !integrationToken) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  let userId: string | undefined = "";

  if (integrationToken) {
    const token = await prisma.token.findUnique({
      where: {
        id: integrationToken,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    userId = token?.user.id;
  }

  if (session) {
    userId = session.user.id;
  }

  const {
    projectId,
    name,
    type,
    authorization,
    folderId,
  }: z.infer<typeof ArgTypes> = req.body;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!project) {
    return res.status(400).send({
      error: "Project does not exist.",
    });
  }

  if (project.ownerId !== userId) {
    return res.status(403).send({
      error: "You are not authorized to add a route to this project.",
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
    return res.status(400).send({
      error: "Route already exists in this folder",
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
      authorization: authorization || AuthorizationType.NONE,
    },
    include: {
      models: true,
    },
  });

  if (!createdRoute) {
    res.status(500).send({
      error: "Something went wrong",
    });
  }

  return res.status(200).send(createdRoute);
};

export default handler;
