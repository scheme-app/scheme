import { FC } from "react";
import AuthorizationField from "./AuthorizationField";

type AuthorizationPropTypes = {
  authorization:
    | "NONE"
    | "BEARER"
    | "API_KEY"
    | "BASIC"
    | "DIGEST"
    | "OAUTH1"
    | "OAUTH2";
};

const Authorization: FC<AuthorizationPropTypes> = ({ authorization }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-light">Authorization</h1>
      <AuthorizationField authorization={authorization} />
    </div>
  );
};

export default Authorization;
