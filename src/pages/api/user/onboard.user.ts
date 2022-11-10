import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await validateSession(req, res);
    const { name, username, projectName } = req.body;

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
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
                      id: session.user.id,
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
        // tokens: {
        //   create: {
        //     name: "Raycast",
        //   },
        // },
        onboarded: true,
      },
    });

    return res.status(StatusCodes.OK).send(user);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
