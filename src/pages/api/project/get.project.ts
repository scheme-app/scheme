import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";
import { StatusCodes } from "http-status-codes";

type RequestType = {
  projectId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { projectId }: RequestType = req.query;

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

    return res.status(StatusCodes.OK).send(project);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
