import { FC, useState, useEffect, useRef } from "react";
import EditAuthorizationFieldPopover from "../components/EditAuthorizationFieldPopover";
import autoAnimate from "@formkit/auto-animate";
import Image from "next/future/image";
import lock from "../../public/lock.svg";
import openLock from "../../public/openLock.svg";

type AuthorizationFieldPropTypes = {
  authorization: "NONE" | "BEARER" | "API_KEY" | "BASIC" | "DIGEST" | "OAUTH";
};

const AuthorizationField: FC<AuthorizationFieldPropTypes> = ({
  authorization,
}) => {
  const formattedAuthorization = {
    NONE: "None",
    BEARER: "Bearer Token",
    API_KEY: "API Key",
    BASIC: "Basic",
    DIGEST: "Digest",
    OAUTH: "OAuth",
  };

  const [showEditFieldPopover, setShowEditFieldPopover] = useState(false);

  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 200,
        easing: "ease-in-out",
      });
  }, [parent]);

  return (
    <div ref={parent}>
      <div className="relative mx-1 mt-2 flex flex-row items-center">
        <div className="mr-12 flex items-center rounded-md bg-[#F2F2F2] py-1.5 px-4">
          {authorization === "NONE" ? (
            // <MdLockOpen className="h-6 w-6 text-[#747474]" />
            <Image src={openLock} width={14} height={14} alt="no auth" />
          ) : (
            // <MdLockOutline className="h-6 w-6 text-[#747474]" />
            <Image src={lock} width={14} height={14} alt="auth" />
          )}
        </div>
        <div className="w-2/5">
          <p className="truncate text-lg font-light">
            {formattedAuthorization[authorization]}
          </p>
        </div>
        <div className="absolute right-0 mr-1 flex flex-row">
          {/* <button
            className="mr-2 flex items-center justify-center rounded-md bg-[#F2F2F2] p-1.5"
            onClick={() => {
              setShowEditFieldPopover(!showEditFieldPopover);
            }}
          >
            <BiPencil className="h-6 w-6 text-[#969696]" />
          </button> */}
          <button
            onClick={() => {
              setShowEditFieldPopover(!showEditFieldPopover);
            }}
          >
            <h1 className="text-sm font-light text-[#969696]">edit</h1>
          </button>
        </div>
      </div>
      {showEditFieldPopover && (
        <EditAuthorizationFieldPopover
          authorization={authorization}
          setAuthorizationFieldPopover={setShowEditFieldPopover}
        />
      )}
    </div>
  );
};

export default AuthorizationField;
