// React
import type { NextPage } from "next";
import { useEffect, useContext } from "react";

//Context
import RouteContext from "@/context/Route.context";

//auth
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

//components
import LayoutTmp from "@components/LayoutTmp";
import { Route, CreateRoute } from "@/components/route";

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const { routeId } = context.query;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  if (session.user.onboarded === false) {
    return {
      redirect: {
        destination: "/newUser",
      },
    };
  }

  return {
    props: {
      routeIdProp: routeId || "",
      session: session,
    },
  };
}

const Home: NextPage<{ routeIdProp: string }> = ({ routeIdProp }) => {
  const { routeId, setRouteId } = useContext(RouteContext);

  useEffect(() => {
    if (routeIdProp !== "") {
      setRouteId(routeIdProp);
      routeIdProp = "";
    }
  }, []);

  return <LayoutTmp>{routeId === "" ? <CreateRoute /> : <Route />}</LayoutTmp>;
};

export default Home;
