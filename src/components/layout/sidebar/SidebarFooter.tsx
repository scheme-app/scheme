import { FC } from "react";
import Image from "next/future/image";
import SchemeMiniLogo from "../../../../public/scheme-mini-logo.svg";

const SidebarFooter: FC = () => {
  return (
    <div className="mt-6 flex flex-row items-center justify-between">
      <h1 className="text-xs text-[#969696]">Scheme v1.0 — Private Alpha</h1>
      <Image
        src={SchemeMiniLogo}
        className="h-[1.1rem] w-[1.1rem]"
        alt="logo"
      />
    </div>
  );
};

export { SidebarFooter };
