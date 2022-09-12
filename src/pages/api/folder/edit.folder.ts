import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { folderId, ...data } = req.body;

  console.log("folderId", folderId);

  console.log("data", data);

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });

  if (!folder) {
    return res.status(404).json({ error: "Folder not found" });
  }

  const editedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: data,
  });

  if (!editedFolder) {
    return res.status(500).json({ error: "Failed to updated folder" });
  }

  console.log("editedFolder", editedFolder);

  return res.status(200).json(editedFolder);
};

export default handler;
