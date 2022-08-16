import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const ArgTypes = z.object({
  parentModelId: z.string().cuid(),
  name: z.string().min(1),
  type: z.enum(["STRING", "INT", "BOOLEAN", "COMPLEX"]),
  optional: z.boolean().optional().default(false),
  array: z.boolean().optional().default(false),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    parentModelId,
    name,
    type,
    optional,
    array,
  }: z.infer<typeof ArgTypes> = req.body;

  const model = await prisma.model.update({
    where: {
      id: parentModelId,
    },
    data: {
      fields: {
        create: {
          name: name,
          type: type,
          optional: optional || false,
          array: array || false,
        },
      },
    },
  });

  return res.status(200).send(model);
};

export default handler;
