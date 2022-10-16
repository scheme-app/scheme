import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, projectId } = req.body;

  console.log("name", name);
  console.log("projectId", projectId);

  const folder = await prisma.folder.create({
    data: {
      name: name,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });

  if (!folder) {
    return res.status(404).json({ error: "Folder not created" });
  }

  return res.status(200).json(folder);
};

export default handler;
