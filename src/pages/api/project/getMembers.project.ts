import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";
import { StatusCodes } from "http-status-codes";

type RequestQuery = {
  projectId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { projectId }: RequestQuery = req.query;

    const members = await prisma.project
      .findUnique({
        where: {
          id: projectId,
        },
      })
      .roles({
        select: {
          type: true,
          users: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

    return res.status(StatusCodes.OK).json(members);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
