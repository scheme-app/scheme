import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { z } from "zod";

const ArgTypes = z.object({
  fieldId: z.string().cuid(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fieldId }: z.infer<typeof ArgTypes> = req.body;

  const field = await prisma.field.findUnique({
    where: {
      id: fieldId,
    },
  });

  if (!field) return res.status(404).json({ error: "Field not found" });

  const deletedField = await prisma.field.delete({
    where: {
      id: fieldId,
    },
  });

  if (!deletedField)
    return res.status(500).json({ error: "Field not deleted" });

  return res.status(200).json(deletedField);
};

export default handler;
