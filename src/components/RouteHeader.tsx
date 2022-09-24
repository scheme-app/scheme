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
    <div className="mt-2 flex h-6 items-center rounded-[0.25rem] bg-[#FBF3EE] px-1">
      <h1 className="text-md font-medium tracking-wider text-[#D6B29D]">
        POST
      </h1>
    </div>
  );
};

const GetTag: FC = () => {
  return (
    <div className="mt-2 flex h-6 items-center rounded-[0.25rem] bg-[#EBF7F7] px-1.5">
      <h1 className="text-md font-medium tracking-wider text-[#86B0B1]">GET</h1>
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
      <div className="mt-20 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-x-4">
          <h1 className="text-4xl font-[325]">{name}</h1>
          {type === "GET" ? <GetTag /> : <PostTag />}
        </div>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md border-[1px] border-[#E4E4E4] hover:bg-[#F2F2F2]"
          onClick={() => {
            setShowEditRoutePopover(!showEditRoutePopover);
          }}
        >
          <h1 className="mb-2 text-[#969696]">...</h1>
        </button>
      </div>
      <div ref={parent}>
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
