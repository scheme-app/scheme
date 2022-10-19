import type { NextPage } from "next";
import Head from "next/head";

const Test2: NextPage = () => {
  return (
    <>
      <Head>
        <title>My post using tailwindcss</title>
        <meta
          property="og:image"
          content="http://localhost:3000/api/og?routeId=cl92ap3ig3375om7nek6cmksl"
        />
      </Head>
      <div>
        <h1>Hello</h1>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  // const session = await unstable_getServerSession(
  //   context.req,
  //   context.res,
  //   authOptions
  // );

  const { routeId } = context.query;

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //     },
  //   };
  // }

  // if (session.user.onboarded === false) {
  //   return {
  //     redirect: {
  //       destination: "/newUser",
  //     },
  //   };
  // }

  return {
    props: {
      routeIdProp: routeId || "",
      // session: session,
    },
  };
}

export default Test2;
