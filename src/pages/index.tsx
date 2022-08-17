import type { NextPage } from "next";
import Field from "../components/Field";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RouteHeader from "../components/RouteHeader";

const Home: NextPage = () => {
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
            <RouteHeader name="createUser" type="POST" />
            {/*
            
            */}
            <ScrollArea.Root className="mt-8">
              <ScrollArea.Viewport className="h-[40rem]">
                <div className="flex flex-col">
                  <h1 className="text-xl font-light">Authorization</h1>
                  <Field
                    type="AUTH"
                    name="Bearer"
                    array={false}
                    optional={false}
                  />
                </div>
                <div className="mt-8 flex flex-col">
                  <h1 className="text-xl font-light">Arguments</h1>
                  <Field
                    type="STRING"
                    name="username"
                    array={false}
                    optional={true}
                  />
                  <Field
                    type="STRING"
                    name="email"
                    array={true}
                    optional={true}
                  />
                  <Field
                    type="BOOLEAN"
                    name="approved"
                    array={false}
                    optional={false}
                  />
                  <Field
                    type="BOOLEAN"
                    name="approved"
                    array={false}
                    optional={false}
                  />
                </div>
                <div className="mt-8 flex flex-col">
                  <h1 className="text-xl">Response</h1>
                  <Field
                    type="STRING"
                    name="username"
                    array={false}
                    optional={false}
                  />
                  <Field
                    type="STRING"
                    name="email"
                    array={false}
                    optional={false}
                  />
                  <Field
                    type="BOOLEAN"
                    name="approved"
                    array={false}
                    optional={false}
                  />
                  <Field
                    type="BOOLEAN"
                    name="approved"
                    array={false}
                    optional={false}
                  />
                  <Field
                    type="BOOLEAN"
                    name="approved"
                    array={false}
                    optional={false}
                  />
                  <Field
                    type="BOOLEAN"
                    name="approved"
                    array={false}
                    optional={false}
                  />
                </div>
                <ScrollArea.Scrollbar orientation="vertical">
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Viewport>
            </ScrollArea.Root>
            {/*
            
            */}
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
