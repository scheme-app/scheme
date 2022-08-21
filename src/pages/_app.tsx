import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Inspect from "inspx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouteContext from "../context/Route.context";
import { useState } from "react";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [routeId, setRouteId] = useState("cl72yymvx7043itlp4gbcpvzi");

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Inspect>
          <RouteContext.Provider value={{ routeId, setRouteId }}>
            <Component {...pageProps} />
          </RouteContext.Provider>
        </Inspect>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
