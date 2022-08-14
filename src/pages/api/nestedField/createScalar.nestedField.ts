import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const ArgTypes = z.object({
  nestedModelId: z.string().cuid().optional(),
  name: z.string().min(1).max(255),
  type: z.enum(["STRING", "INT", "BOOLEAN", "COMPLEX"]),
  optional: z.boolean().optional().default(false),
  array: z.boolean().optional().default(false),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    nestedModelId,
    name,
    type,
    optional,
    array,
  }: z.infer<typeof ArgTypes> = req.body;

  const model = await prisma.nestedModel.update({
    where: {
      id: nestedModelId,
    },
    data: {
      fields: {
        create: {
          name: name,
          type: type,
          optional: optional,
          array: array,
        },
      },
    },
  });
};

export default handler;
