import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../utils/prisma";
import { FieldType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { routeId }: { routeId?: string } = req.query;

  const route = await prisma.route.findUnique({
    where: {
      id: routeId,
    },
    include: {
      models: {
        include: {
          fields: {
            include: {
              models: {
                where: {
                  type: "CHILD",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!route) {
    return res.status(400).send({
      error: "Route does not exist.",
    });
  }

  const parentModels = route.models.filter((model) => model.type === "PARENT");
  const childModels = route.models.filter((model) => model.type === "CHILD");

  parentModels.map((parentModel) => {
    parentModel.fields.map((field) => {
      if (
        field.type === "STRING" ||
        field.type === "BOOLEAN" ||
        field.type === "INT"
      ) {
        console.log(field.name + ": " + field.type);
      } else {
        childModels.map((childModel) => {
          if (childModel.id === field.models[0]!.id) {
            childModel.fields.map((field) => {
              if (
                field.type === "STRING" ||
                field.type === "BOOLEAN" ||
                field.type === "INT"
              ) {
                console.log("  " + field.name + ": " + field.type);
              } else {
              }
            });
          }
        });
      }
    });
  });

  return res.status(200).send(route);
};

export default handler;
