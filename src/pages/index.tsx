import type { NextPage } from "next";
import Field from "../components/Field";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RouteHeader from "../components/RouteHeader";
import AuthorizationField from "../components/AuthorizationField";
import { useQuery } from "@tanstack/react-query";

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
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="w-1/4 flex-col items-center justify-center border-r-[1.5px] border-[#E4E4E4]">
          <h1>Side Bar</h1>
        </div>
        <div className="h-screen w-full flex-col justify-center p-8 px-24">
          <div className="flex flex-row gap-x-2">
            <h1 className="text-sm italic tracking-wider text-[#969696]">
              Index / user /
            </h1>
            <h1 className="text-sm text-black underline">createUser</h1>
          </div>
          <div className="ml-20">
            <RouteHeader name={data.name} type={data.type} />
            <ScrollArea.Root className="mt-8">
              <ScrollArea.Viewport className="h-[39rem] w-full">
                <div className="flex flex-col">
                  <h1 className="text-xl font-light">Authorization</h1>
                  <AuthorizationField authorization={data.authorization} />
                </div>
                <div className="mt-8 flex flex-col">
                  <h1 className="text-xl font-light">Arguments</h1>
                  {data.models[0].fields.map(
                    ({
                      id,
                      name,
                      type,
                      array,
                      optional,
                    }: {
                      id: string;
                      name: string;
                      type: "STRING" | "INT" | "BOOLEAN";
                      array: boolean;
                      optional: boolean;
                    }) => (
                      <Field
                        id={id}
                        name={name}
                        type={type}
                        array={array}
                        optional={optional}
                      />
                    )
                  )}
                </div>
                <div className="mt-8 flex flex-col">
                  <h1 className="text-xl font-light">Response</h1>
                  {data.models[1].fields.map(
                    ({
                      id,
                      name,
                      type,
                      array,
                      optional,
                    }: {
                      id: string;
                      name: string;
                      type: "STRING" | "INT" | "BOOLEAN";
                      array: boolean;
                      optional: boolean;
                    }) => (
                      <Field
                        id={id}
                        name={name}
                        type={type}
                        array={array}
                        optional={optional}
                      />
                    )
                  )}
                </div>
                <ScrollArea.Scrollbar orientation="vertical">
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 mr-8 mb-8 flex flex-row items-center gap-x-2 rounded-lg bg-green-300/20 py-1 px-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
          <h1 className="text-sm text-green-400">Pre-Alpha</h1>
        </div>
      </div>
    </>
  );
};

export default Home;
