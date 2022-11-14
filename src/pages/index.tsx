// React
import type { NextPage } from "next";
import { useEffect, useContext } from "react";
import Head from "next/head";

//Context
import RouteContext from "@/context/Route.context";

//auth
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

//components
import { Layout } from "@components/layout";
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

  return (
    <>
      <Head>
        <title>Scheme⠀-⠀Alpha.</title>
        <meta property="og:title" content="Scheme⠀-⠀Alpha." key="title" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_VERCEL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Scheme Alpha" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/scheme-link-preview.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@scheme_app" />
        <meta name="twitter:title" content="Scheme - Alpha." />
        <meta name="twitter:description" content="Join the Waitlist" />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/scheme-link-preview.png`}
        />
      </Head>
      <Layout>{routeId === "" ? <CreateRoute /> : <Route />}</Layout>
      {/* <h1>Hello</h1> */}
    </>
  );
};

export default Home;
