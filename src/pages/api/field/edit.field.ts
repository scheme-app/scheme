import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";
import type { FieldFormat, FieldType } from "@prisma/client";

type RequestBody = {
  fieldId: string;
  name?: string;
  type?: FieldType;
  optional?: boolean;
  array?: boolean;
  format?: FieldFormat;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fieldId, ...data }: RequestBody = req.body;
    const field = await prisma.field.update({
      where: {
        id: fieldId,
      },
      data: {
        ...data,
      },
    });

    return res.status(200).json(field);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
