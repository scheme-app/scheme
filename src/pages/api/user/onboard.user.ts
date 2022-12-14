import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    const { name, username, projectName } = req.body;

    const user = await prisma.user.update({
      where: {
        id: session!.user.id,
        // id: userId,
      },
      data: {
        name: name,
        username: username,
        projects: {
          create: {
            name: projectName,
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
        },
        onboarded: true,
      },
    });

    return res.status(StatusCodes.OK).send(user);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
