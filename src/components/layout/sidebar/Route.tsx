import { FC, useContext, useEffect } from "react";
import RouteContext from "@/context/Route.context";
import { useQueryClient } from "@tanstack/react-query";
import { BsFileEarmarkCode } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import type { RouteType } from "@prisma/client";

type RoutePropTypes = {
  id: string;
  name: string;
  type: RouteType;
};

const PostTag: FC = () => {
  return (
    <div className="flex items-center rounded-[0.25rem] bg-[#FBF3EE] px-1 py-0.5">
      <h1 className="text-xs font-medium tracking-wide text-[#D6B29D]">POST</h1>
    </div>
  );
};

const GetTag: FC = () => {
  return (
    <div className="flex items-center rounded-[0.25rem] bg-[#ebf7f7] px-1 py-0.5">
      <h1 className="text-xs font-medium tracking-wide text-[#86B0B1]">GET</h1>
    </div>
  );
};

const Route: FC<RoutePropTypes> = ({ id, name, type }) => {
  const { routeId, setRouteId, setNewRouteType } = useContext(RouteContext);

  const router = useRouter();

  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetch = async () => {
      await queryClient.prefetchQuery([id], async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/route/get.route?routeId=${id}`
        );

        return response.data;
      });
    };
    prefetch();
  }, []);

  return (
    <div
      className={`flex flex-row items-center rounded-md px-2 ${
        routeId === id ? "bg-[#F2F2F2]" : ""
      } hover:bg-[#F2F2F2]`}
    >
      <button
        className="py-2"
        onClick={() => {
          // queryClient.invalidateQueries([routeId]);
          setRouteId(id);
          setNewRouteType("NONE");
          router.push(`?routeId=${id}`, undefined, { shallow: true });
        }}
      >
        <div className="flex flex-row items-center gap-x-4">
          <BsFileEarmarkCode className="h-5 w-5 text-[#969696]" />
          <div className="flex w-36 flex-row justify-start truncate">
            <h1 className="text-sm">{name}</h1>
          </div>
          <div>{type === "GET" ? <GetTag /> : <PostTag />}</div>
        </div>
      </button>
    </div>
  );
};

export { Route };
export type { RoutePropTypes };
