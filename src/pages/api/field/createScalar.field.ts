import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const ArgTypes = z.object({
  parentModelId: z.string().cuid(),
  name: z.string().min(1),
  type: z.enum(["STRING", "INT", "BOOLEAN"]),
  optional: z.boolean().optional().default(false),
  array: z.boolean().optional().default(false),
  format: z
    .enum([
      "NONE",
      "INT32",
      "INT64",
      "FLOAT",
      "DOUBLE",
      "BYTE",
      "BINARY",
      "DATE",
      "DATE_TIME",
      "PASSWORD",
    ])
    .default("NONE"),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    parentModelId,
    name,
    type,
    optional,
    array,
    format,
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
          format: format || "NONE",
        },
      },
    },
  });

  return res.status(200).send(model);
};

export default handler;
