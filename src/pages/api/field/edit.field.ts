import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const ArgTypes = z.object({
  fieldId: z.string().cuid(),
  name: z.string().min(1).optional(),
  type: z.enum(["STRING", "INT", "BOOLEAN"]).optional(),
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
  const { fieldId, ...data }: z.infer<typeof ArgTypes> = req.body;

  const field = await prisma.field.findUnique({
    where: {
      id: fieldId,
    },
  });

  if (!field) return res.status(404).json({ error: "Field not found" });

  const updatedField = await prisma.field.update({
    where: {
      id: fieldId,
    },
    data: {
      ...data,
    },
  });

  if (!updatedField)
    return res.status(500).json({ error: "Field not updated" });

  return res.status(200).json(updatedField);
};

export default handler;
