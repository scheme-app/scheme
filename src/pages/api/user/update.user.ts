import { NextApiRequest, NextApiResponse } from "next";
import { prisma, handleError, validateSession } from "@utils";
import { StatusCodes } from "http-status-codes";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const { userId, ...data }: RequestBody = req.body;
    // const session = await validateSession(req, res);
    const session = validateSession(
      await unstable_getServerSession(req, res, authOptions),
      res
    );

    const { ...data } = req.body;

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...data,
      },
    });

    return res.status(StatusCodes.OK).send(user);
  } catch (error) {
    handleError(error, res);
  }
};

export default handler;
