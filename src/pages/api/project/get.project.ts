import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { projectId }: { projectId?: string } = req.query;

  if (!projectId) {
    return res.status(400).send({
      error: "Project id is required.",
    });
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      folders: {
        include: {
          routes: true,
        },
      },
      routes: {
        where: {
          folderId: null,
        },
      },
    },
  });

  if (!project) {
    return res.status(400).send({
      error: "Project does not exist.",
    });
  }

  return res.status(200).send(project);
};

export default handler;
