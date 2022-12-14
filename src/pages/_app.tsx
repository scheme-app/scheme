import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Inspect from "inspx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteContext from "../context/Route.context";
import { useState } from "react";
import ProjectContext from "../context/Project.context";
import { Session } from "next-auth";

const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [routeId, setRouteId] = useState("");
  const [newRouteType, setNewRouteType] = useState<"NONE" | "NEW" | "IMPORT">(
    "NONE"
  );
  const [folder, setFolder] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const [project, setProject] = useState({
    id: "",
    name: "",
  });

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Inspect>
          <ProjectContext.Provider value={{ project, setProject }}>
            <RouteContext.Provider
              value={{
                routeId,
                setRouteId,
                newRouteType,
                setNewRouteType,
                folder,
                setFolder,
              }}
            >
              <Component {...pageProps} />
            </RouteContext.Provider>
          </ProjectContext.Provider>
        </Inspect>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
