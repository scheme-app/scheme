import { FC, useContext } from "react";
import RouteContext from "@/context/Route.context";

import { HiOutlinePlusSm } from "react-icons/hi";
import { Route } from "./Route";

import type { RouteType } from "@prisma/client";

type Route = {
  id: string;
  name: string;
  type: RouteType;
};

type PropTypes = {
  routes: Array<Route>;
};

const Routes: FC<PropTypes> = ({ routes }) => {
  const { setRouteId, setFolder, setNewRouteType } = useContext(RouteContext);

  return (
    <>
      <div className="mt-6 mb-2 flex flex-row items-center justify-between">
        <h1 className="text-[1rem]">Routes</h1>
        <button
          className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] outline-none ring-0 hover:bg-[#F2F2F2]"
          onClick={() => {
            setNewRouteType("NONE");
            setFolder({ id: "", name: "" });
            setRouteId("");
          }}
        >
          <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
        </button>
      </div>
      {routes &&
        routes.map((route: Route) => (
          <Route
            key={route.id}
            id={route.id}
            name={route.name}
            type={route.type}
          />
        ))}
    </>
  );
};

export { Routes };
