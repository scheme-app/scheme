import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { modelId }: { modelId?: string } = req.query;

  if (!modelId) {
    return res.status(400).send({
      error: "Model id is required.",
    });
  }

  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
    include: {
      fields: {
        include: {
          models: true,
        },
      },
    },
  });

  if (!model) {
    return res.status(400).send({
      error: "Model does not exist.",
    });
  }

  return res.status(200).send(model);
};

export default handler;
