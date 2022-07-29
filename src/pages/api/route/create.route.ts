import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { getToken } from "next-auth/jwt";
import { AuthorizationType } from "@prisma/client";
import { z } from "zod";

const ArgTypes = z.object({
  projectId: z.string().cuid(),
  name: z.string(),
  type: z.enum(["GET", "POST"]),
  folderId: z.string().cuid().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  const { projectId, name, type, folderId }: z.infer<typeof ArgTypes> =
    req.body;

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

  if (project.ownerId !== token.userId) {
    return res.status(403).send({
      error: "You are not authorized to add a route to this project.",
    });
  }

  const route = await prisma.route.findMany({
    where: {
      folderId: folderId,
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
          { name: "Arguments", type: "ARGUMENT" },
          { name: "Response", type: "RESPONSE" },
        ],
      },
      authorization: AuthorizationType.NONE,
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
