import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  const { name } = req.body;

  const project = await prisma.project.findMany({
    where: {
      ownerId: token.userId,
      name: name,
    },
  });

  if (project.length > 0) {
    return res.status(400).send({
      error: "Project already exists.",
    });
  }

  const createdProject = await prisma.project.create({
    data: {
      name: name,
      owner: {
        connect: {
          id: token.userId,
        },
      },
    },
  });

  if (!createdProject) {
    res.status(500).send({
      error: "Something went wrong",
    });
  }

  return res.status(200).send(createdProject);
};

export default handler;
