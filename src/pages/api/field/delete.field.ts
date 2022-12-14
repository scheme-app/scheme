import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError } from "@utils";

type RequestBody = {
  fieldId: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fieldId }: RequestBody = req.body;

    const field = await prisma.field.delete({
      where: {
        id: fieldId,
      },
    });

    return res.status(200).json(field);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
