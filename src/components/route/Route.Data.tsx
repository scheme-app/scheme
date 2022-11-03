import { FC } from "react";
import RouteHeader from "./RouteHeader";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { AuthorizationModel } from "./AuthorizationModel";
import { Model } from "./Model";
import { FieldFormat, AuthorizationType } from "@prisma/client";

type Field = {
  id: string;
  name: string;
  type: "STRING" | "INT" | "BOOLEAN" | "COMPLEX";
  array: boolean;
  optional: boolean;
  format: FieldFormat;
};

type Model = {
  id: string;
  fields: Array<Field>;
};

type PropTypes = {
  id: string;
  name: string;
  type: "GET" | "POST";
  authorization: AuthorizationType;
  models: Array<Model>;
};

const RouteData: FC<PropTypes> = ({
  id,
  name,
  type,
  authorization,
  models,
}) => {
  return (
    <div className="w-[65%]">
      <RouteHeader id={id} name={name} type={type} />
      <ScrollArea.Root className="mt-8">
        <ScrollArea.Viewport className="h-[44rem] w-full">
          <AuthorizationModel authorization={authorization} />
          <Model
            name="Arguments"
            id={models[0]!.id}
            fields={models[0]!.fields}
          />
          <Model
            name="Response"
            id={models[1]!.id}
            fields={models[1]!.fields}
          />
          <div className="py-8"></div>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
};

// export default RouteData;
export { RouteData };
