import { FC } from "react";

type PropTypes = {
  name: string;
  type: "GET" | "POST";
};

const PostTag: FC = () => {
  return (
    <div className="mt-2 flex h-7 items-center rounded-md bg-[#FBF3EE] px-2">
      <h1 className="text-lg font-semibold text-[#D6B29D]">POST</h1>
    </div>
  );
};

const GetTag: FC = () => {
  return (
    <div className="mt-2 flex h-7 items-center rounded-md bg-[#EBF7F7] px-3">
      <h1 className="text-lg font-semibold text-[#86B0B1]">GET</h1>
    </div>
  );
};

const RouteHeader: FC<PropTypes> = ({ name, type }) => {
  return (
    <div className="mt-24 flex flex-row items-center gap-x-4">
      <h1 className="text-4xl">{name}</h1>
      {type === "GET" ? <GetTag /> : <PostTag />}
    </div>
  );
};

export default RouteHeader;
