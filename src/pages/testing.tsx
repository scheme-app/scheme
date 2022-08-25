import type { NextPage } from "next";

const Testing: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mt-6 flex h-20 w-60 flex-col items-center justify-center rounded-xl border-[1.5px] border-[#E4E4E4]">
        <div className="flex w-full flex-row">
          <h1 className="ml-4 text-[#969696]">Club Compass</h1>
        </div>
        <div className="mt-2 w-full">
          <h1 className="ml-4 text-[#969696] ">v0.0.1</h1>
        </div>
      </div>
    </div>
  );
};

export default Testing;
