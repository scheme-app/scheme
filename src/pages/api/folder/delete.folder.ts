import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { folderId } = req.body;

  if (!folderId) {
    return res.status(400).send({
      error: "Folder id is required",
    });
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    return res.status(400).send({
      error: "Folder does not exist.",
    });
  }

  const deletedFolder = await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });

  if (!deletedFolder)
    return res.status(500).json({ error: "Field not deleted" });

  return res.status(200).json(deletedFolder);
};

export default handler;
