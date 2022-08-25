import { FC, useState, useEffect, useRef } from "react";
import EditRoutePopover from "./EditRoutePopover";
import autoAnimate from "@formkit/auto-animate";

type PropTypes = {
  name: string;
  type: "GET" | "POST";
  folder?: {
    id: string;
    name: string;
  };
};

const PostTag: FC = () => {
  return (
    <div className="mt-2 flex h-7 items-center rounded-md bg-[#FBF3EE] px-2">
      <h1 className="text-lg font-semibold tracking-wider text-[#D6B29D]">
        POST
      </h1>
    </div>
  );
};

const GetTag: FC = () => {
  return (
    <div className="mt-2 flex h-7 items-center rounded-md bg-[#EBF7F7] px-3">
      <h1 className="text-lg font-semibold tracking-wider text-[#86B0B1]">
        GET
      </h1>
    </div>
  );
};

const RouteHeader: FC<PropTypes> = ({ name, type, folder }) => {
  const [showEditRoutePopover, setShowEditRoutePopover] = useState(false);

  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 200,
        easing: "ease-in-out",
      });
  }, [parent]);

  return (
    <>
      <div className="mt-24 flex w-[60%] flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-x-4">
          <h1 className="text-4xl">{name}</h1>
          {type === "GET" ? <GetTag /> : <PostTag />}
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md border-[1.5px] border-[#E4E4E4] hover:bg-[#F2F2F2]"
          onClick={() => {
            setShowEditRoutePopover(!showEditRoutePopover);
          }}
        >
          <h1 className="mb-2 text-[#969696]">...</h1>
        </button>
      </div>
      <div className="w-[60%]" ref={parent}>
        {showEditRoutePopover && (
          <EditRoutePopover
            name={name}
            type={type}
            folder={folder}
            setEditRoutePopover={setShowEditRoutePopover}
          />
        )}
      </div>
    </>
  );
};

export default RouteHeader;
