import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const ArgTypes = z.object({
  name: z.string().min(1).max(255),
  parentModelId: z.string().cuid(),
  routeId: z.string().cuid(),
  optional: z.boolean().optional().default(false),
  array: z.boolean().optional().default(false),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    name,
    parentModelId,
    routeId,
    optional,
    array,
  }: z.infer<typeof ArgTypes> = req.body;

  const field = await prisma.field.create({
    data: {
      name: name,
      type: "COMPLEX",
      optional: optional || false,
      array: array || false,
      models: {
        connect: {
          id: parentModelId,
        },
        create: {
          parentModelId: parentModelId,
          type: "CHILD",
          route: {
            connect: {
              id: routeId,
            },
          },
        },
      },
    },
  });

  return res.status(200).send(field);
};

export default handler;
