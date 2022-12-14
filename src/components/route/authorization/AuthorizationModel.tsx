import { FC } from "react";
import AuthorizationField from "./AuthorizationField";
import * as Separator from "@radix-ui/react-separator";

type AuthorizationPropTypes = {
  authorization: "NONE" | "BEARER" | "API_KEY" | "BASIC" | "DIGEST" | "OAUTH";
};

const AuthorizationModel: FC<AuthorizationPropTypes> = ({ authorization }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-md font-light text-[#747474]">Headers</h1>
      <Separator.Root
        decorative
        orientation="horizontal"
        className="my-2 h-[1px] bg-[#E4E4E4]"
      />
      <AuthorizationField authorization={authorization} />
    </div>
  );
};

export { AuthorizationModel };
