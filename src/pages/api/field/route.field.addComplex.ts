import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { getToken } from "next-auth/jwt";
import { array, optional, z } from "zod";

const ArgTypes = z.object({
  fieldName: z.string(),
  modelId: z.string().cuid(),
  optional: z.boolean(),
  array: z.boolean(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  const { fieldName, modelId, optional, array }: z.infer<typeof ArgTypes> =
    req.body;

  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
    select: {
      route: {
        select: {
          project: {
            select: {
              ownerId: true,
            },
          },
        },
      },
      fields: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!model) {
    return res.status(400).send({
      error: "Model does not exist.",
    });
  }

  if (!model.route) {
    return res.status(400).send({
      error: "Model does not belong to a route.",
    });
  }

  if (model.route.project.ownerId !== token.userId) {
    return res.status(403).send({
      error: "You are not authorized to add a route to this project.",
    });
  }

  if (model.fields.find((field) => field.name === fieldName)) {
    return res.status(400).send({
      error: `Field with this name ${fieldName} already exists.`,
    });
  }

  const createdField = await prisma.field.create({
    data: {
      name: fieldName,
      type: "COMPLEX",
      parentModel: {
        connect: {
          id: modelId,
        },
      },
      optional: optional,
      array: array,
    },
  });

  if (!createdField) {
    res.status(500).send({
      error: "Error creating field.",
    });
  }

  res.status(200).send(createdField);
};

export default handler;
