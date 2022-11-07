import { NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import axios from "axios";
import Head from "next/head";
import { Session } from "next-auth";

const Share: NextPage<{
  session: Session;
  route: {
    id: string;
    name: string;
    type: "GET" | "POST";
    project: {
      id: string;
      name: string;
    };
  };
}> = ({ session, route }) => {
  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={`View route ${route.name} on Scheme`}
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/og?routeId=${route.id}`}
        />
      </Head>
      <h1>
        Error you don't have the permissions to view this route. Please request
        that the owner of the project add you.
      </h1>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const { routeId } = context.query;
  let valid = false;

  const route = await axios.get(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/route/getPreview.route?routeId=${routeId}`
  );

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    if (session.user.onboarded === false) {
      return {
        redirect: {
          destination: "/newUser",
        },
      };
    }

    const user = await axios.get(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/user/get.user?userId=${session.user.id}`
    );

    user.data.projects.map((project: { id: string }) => {
      if (project.id === route.data.project.id) {
        valid = true;
      }
    });
  }

  if (valid) {
    return {
      redirect: {
        destination: `/?routeId=${routeId}`,
      },
    };
  }

  return {
    props: {
      session: session,
      route: route.data,
    },
  };
}

export default Share;
