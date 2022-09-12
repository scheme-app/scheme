import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { integrationToken, name } = req.body;

  if (!token && !integrationToken) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  // const project = await prisma.project.findMany({
  //   where: {

  //     ownerId: token!.userId,
  //     name: name,
  //   },
  // });

  // if (project.length > 0) {
  //   return res.status(400).send({
  //     error: "Project already exists.",
  //   });
  // }

  let userId: string | undefined = "";

  if (integrationToken) {
    const token = await prisma.token.findUnique({
      where: {
        id: integrationToken,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    userId = token?.user.id;
  }

  if (token) {
    userId = token.userId;
  }

  console.log("userId", userId);

  const createdProject = await prisma.project.create({
    data: {
      name: name,
      // ...(token && { owner: { connect: { id: token!.userId } } }),
      // ...(integrationToken && {

      // }),
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (!createdProject) {
    res.status(500).send({
      error: "Something went wrong",
    });
  }

  console.log("createdProject", createdProject);

  return res.status(200).send(createdProject);
};

export default handler;
