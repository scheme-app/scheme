import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

type RequestBody = {
  name: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const session = await unstable_getServerSession(req, res, authOptions);

    const session = validateSession(
      await unstable_getServerSession(req, res, authOptions),
      res
    );

    const { name }: RequestBody = req.body;

    const roles = await prisma.user
      .findUnique({
        where: {
          id: session!.user.id,
        },
      })
      .roles({
        select: {
          project: {
            select: {
              name: true,
            },
          },
        },
      });

    if (!roles) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "No projects" });
    }

    if (roles.some((role) => role.project.name === name)) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: `Already part of a project named ${name}` });
    }

    const createdProject = await prisma.project.create({
      data: {
        name: name,
        roles: {
          create: [
            {
              type: "OWNER",
              users: {
                connect: {
                  id: session!.user.id,
                },
              },
            },
            {
              type: "ADMIN",
            },
            {
              type: "MEMBER",
            },
          ],
        },
      },
    });

    return res.status(StatusCodes.OK).json(createdProject);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
