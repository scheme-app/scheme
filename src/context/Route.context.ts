import { createContext } from "react";

type RouteContext = {
  routeId: string;
  newRouteType: "NONE" | "NEW" | "IMPORT";
  folder: {
    id: string;
    name: string;
  };
  setRouteId: (routeId: string) => void;
  setNewRouteType: (newRouteType: "NONE" | "NEW" | "IMPORT") => void;
  setFolder: (folder: { id: string; name: string }) => void;
};

const RouteContext = createContext<RouteContext>({
  routeId: "",
  newRouteType: "NONE",
  folder: {
    id: "",
    name: "",
  },
  setRouteId: () => {},
  setNewRouteType: () => {},
  setFolder: () => {},
});

export default RouteContext;
