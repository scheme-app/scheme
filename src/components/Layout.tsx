import { FC, ReactNode } from "react";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 flex-col items-center justify-center border-r-[1.5px] border-[#E4E4E4]">
        <h1>Side Bar</h1>
      </div>
      <div className="h-screen w-full flex-col justify-center p-8 px-24">
        <div className="flex flex-row gap-x-2">
          <h1 className="text-sm italic tracking-wider text-[#969696]">
            Index / user /
          </h1>
          <h1 className="text-sm text-black underline">createUser</h1>
        </div>
        <div className="ml-20">{children}</div>
      </div>
      <div className="absolute bottom-0 right-0 mr-8 mb-8 flex flex-row items-center gap-x-2 rounded-lg bg-green-300/20 py-1 px-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
        <h1 className="text-sm text-green-400">Pre-Alpha</h1>
      </div>
    </div>
  );
};

export default Layout;
