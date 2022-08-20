import { createContext } from "react";

type RouteContext = {
  routeId: string;
  setRouteId: (routeId: string) => void;
};

const RouteContext = createContext<RouteContext>({
  routeId: "",
  setRouteId: () => {},
});

export default RouteContext;
