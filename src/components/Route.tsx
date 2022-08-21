import { FC, useContext, useEffect } from "react";
import RouteContext from "../context/Route.context";
import { useQueryClient } from "@tanstack/react-query";
import { TbFileDescription } from "react-icons/tb";

type RoutePropTypes = {
  id: string;
  name: string;
  type: "GET" | "POST";
};

const PostTag: FC = () => {
  return (
    <div className="flex h-5 items-center rounded-[0.25rem] bg-[#FBF3EE] px-1">
      <h1 className="text-sm font-medium tracking-wide text-[#D6B29D]">POST</h1>
    </div>
  );
};

const GetTag: FC = () => {
  return (
    <div className="flex h-5 items-center rounded-[0.25rem] bg-[#EBF7F7] px-1">
      <h1 className="text-sm font-medium tracking-wide text-[#86B0B1]">GET</h1>
    </div>
  );
};

const Route: FC<RoutePropTypes> = ({ id, name, type }) => {
  const { setRouteId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  const { routeId } = useContext(RouteContext);

  const getRoute = async () => {
    console.log("getting route");
    const response = await fetch(
      `http://localhost:3000/api/route/get.route?routeId=${id}`,
      {
        method: "GET",
      }
    );

    return response.json();
  };

  useEffect(() => {
    const prefetch = async () => {
      await queryClient.prefetchQuery([id], getRoute);
    };
    prefetch();
  }, []);

  return (
    <div className="relative flex flex-col pr-16">
      <button
        className="py-2"
        onClick={() => {
          queryClient.invalidateQueries([routeId]);
          setRouteId(id);
        }}
      >
        <div className="flex flex-row items-center">
          <TbFileDescription className="mr-6 h-6 w-6 text-[#969696]" />
          <div className="flex justify-start">
            <h1 className="text-md">{name}</h1>
          </div>
          <div className="absolute right-0">
            {type === "GET" ? <GetTag /> : <PostTag />}
          </div>
        </div>
      </button>
    </div>
  );
};

export default Route;
