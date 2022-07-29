import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <h1>{session?.user?.name}</h1>
      {console.log(session)}
      <h1>Hello</h1>
    </>
  );
};

export default Home;
