import { FC } from "react";
import { BiPencil } from "react-icons/bi";
import { MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";

type AuthorizationFieldPropTypes = {
  authorization:
    | "NONE"
    | "BEARER"
    | "API_KEY"
    | "BASIC"
    | "DIGEST"
    | "OAUTH1"
    | "OAUTH2";
};

const AuthorizationField: FC<AuthorizationFieldPropTypes> = ({
  authorization,
}) => {
  const formattedAuthorization = {
    NONE: "None",
    BEARER: "Bearer",
    API_KEY: "API Key",
    BASIC: "Basic",
    DIGEST: "Digest",
    OAUTH1: "OAuth1",
    OAUTH2: "OAuth2",
  };

  return (
    <div className="relative mt-4 flex w-[55%] flex-row items-center rounded-xl border-[1.5px] border-[#E4E4E4] py-1.5 px-1.5">
      <div className="mr-12 flex items-center rounded-md bg-[#F2F2F2] py-2 px-4">
        {authorization === "NONE" ? (
          <MdLockOpen className="h-7 w-7 text-[#747474]" />
        ) : (
          <MdLockOutline className="h-7 w-7 text-[#747474]" />
        )}
      </div>
      <div className="w-2/5">
        <p className="truncate text-xl font-light">
          {formattedAuthorization[authorization]}
        </p>
      </div>
      <div className="absolute right-0 flex flex-row">
        <div className="mr-2 flex items-center justify-center rounded-md bg-[#F2F2F2] p-1.5">
          <BiPencil className="h-7 w-7 text-[#969696]" />
        </div>
      </div>
    </div>
  );
};

export default AuthorizationField;
