import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

type RequestBody = {
  projectId: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await validateSession(req, res);

    const { projectId }: RequestBody = req.body;

    const roles = await prisma.project
      .findUnique({
        where: {
          id: projectId,
        },
      })
      .roles({
        where: {
          type: "OWNER",
        },
        select: {
          users: {
            select: {
              id: true,
            },
          },
        },
      });

    if (
      !roles!.find((role) =>
        role.users.find((user) => user.id === session.user.id)
      )
    ) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not the owner of this project" });
    }

    const deletedProject = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return res.status(StatusCodes.OK).send(deletedProject);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
