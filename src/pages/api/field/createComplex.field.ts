import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const ArgTypes = z.object({
  fieldName: z.string(),
  parentModelId: z.string().cuid(),
  routeId: z.string().cuid(),
  optional: z.boolean().optional().default(false),
  array: z.boolean().optional().default(false),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }

  const {
    fieldName,
    parentModelId,
    routeId,
    optional,
    array,
  }: z.infer<typeof ArgTypes> = req.body;

  const model = await prisma.model.findUnique({
    where: {
      id: parentModelId,
    },
    select: {
      route: {
        select: {
          id: true,
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

  if (routeId !== model.route.id) {
    return res.status(400).send({
      error: "Route does not belong to this model.",
    });
  }

  const createdField = await prisma.field.create({
    data: {
      name: fieldName,
      type: "COMPLEX",
      parentModel: {
        connect: {
          id: parentModelId,
        },
      },
      nestedModel: {
        create: {
          parentRoute: {
            connect: {
              id: routeId,
            },
          },
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

  const savedNestedField = await prisma.route.update({
    where: {
      id: routeId,
    },
    data: {
      nestedModels: {
        connect: {
          id: createdField.nestedModelId!,
        },
      },
    },
  });

  if (!savedNestedField) {
    await prisma.field.delete({
      where: {
        id: createdField.nestedModelId!,
      },
    });

    res.status(500).send({
      error: "Error saving nested field.",
    });
  }

  return res.status(200).send(createdField && savedNestedField);
};

export default handler;
