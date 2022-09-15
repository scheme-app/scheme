import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { folderId } = req.query;

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId as string,
    },
    select: {
      routes: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  if (!folder) {
    return res.status(404).json({ error: "Folder not found" });
  }

  return res.status(200).json(folder);
};

export default handler;
