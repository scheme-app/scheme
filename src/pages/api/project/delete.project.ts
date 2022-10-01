import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).send({
      error: "Project id is required.",
    });
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId as string,
    },
  });

  if (!project) {
    return res.status(400).send({
      error: "Project does not exist.",
    });
  }

  const deletedProject = await prisma.project.delete({
    where: {
      id: projectId as string,
    },
  });

  if (!deletedProject) {
    return res.status(500).send({
      error: "Failed to delete project",
    });
  }

  return res.status(200).send(deletedProject);
};

export default handler;
