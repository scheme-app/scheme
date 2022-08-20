import type { NextPage } from "next";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RouteHeader from "../components/RouteHeader";
import { useQuery } from "@tanstack/react-query";
import ParentModel from "../components/ParentModel";
import Authorization from "../components/Authorization";
import Layout from "../components/Layout";

const getRoute = async () => {
  const response = await fetch(
    `http://localhost:3000/api/route/get.route?routeId=cl6tndaop0043rhlp64js7s6k`,
    {
      method: "GET",
    }
  );

  return response.json();
};

const Home: NextPage = () => {
  const { data, status } = useQuery(["route"], getRoute);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <RouteHeader name={data.name} type={data.type} />
      <ScrollArea.Root className="mt-8">
        <ScrollArea.Viewport className="h-[38rem] w-full">
          <Authorization authorization={data.authorization} />
          <ParentModel
            name="Arguments"
            fields={data.models[0].fields}
            id={data.models[0].id}
          />
          <ParentModel
            name="Response"
            fields={data.models[1].fields}
            id={data.models[1].id}
          />
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </Layout>
  );
};

export default Home;
