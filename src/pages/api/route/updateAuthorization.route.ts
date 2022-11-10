import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import type { AuthorizationType } from "@prisma/client";

type RequestBody = {
  routeId: string;
  authorization: AuthorizationType;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const session = await validateSession(req, res);

    const { routeId, authorization }: RequestBody = req.body;

    const updatedRoute = await prisma.route.update({
      where: {
        id: routeId,
      },
      data: {
        authorization: authorization,
      },
    });

    return res.status(StatusCodes.OK).json(updatedRoute);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
