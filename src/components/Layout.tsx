import { FC, ReactNode, useState, useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Folder from "../components/Folder";
import { useQuery } from "@tanstack/react-query";
import Route from "./Route";
import { useNetworkState } from "react-use";
import { TbWifiOff } from "react-icons/tb";
import autoAnimate from "@formkit/auto-animate";
import ComplexModelViewer from "./ComplexModelViewer";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const getProject = async () => {
    const response = await fetch(
      `http://localhost:3000/api/project/get.project?projectId=cl6tnc57v0025rhlpu8pnnhrd`,
      {
        method: "GET",
      }
    );

    return response.json();
  };

  const { data, status } = useQuery(["cl6tnc57v0025rhlpu8pnnhrd"], getProject);

  const { online } = useNetworkState();

  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 200,
        easing: "ease-in-out",
      });
  }, [parent]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 flex-col items-center justify-center border-r-[1.5px] border-[#E4E4E4] p-8 pr-12 pb-24">
        <h1 className="mb-8 text-2xl font-medium">Scheme</h1>
        <ScrollArea.Root>
          <ScrollArea.Viewport className="h-[40rem] w-full">
            <div className="mb-3 flex flex-row items-center justify-between">
              <h1 className="text-lg">Folders</h1>
              <button className="flex h-6 w-6 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] hover:bg-[#F2F2F2]">
                <h1 className="mb-0.5 text-xl text-[#969696]">+</h1>
              </button>
            </div>
            {data.folders.map((folder: any) => (
              <Folder
                key={folder.id}
                name={folder.name}
                routes={folder.routes.map((route: any) => {
                  return {
                    id: route.id,
                    name: route.name,
                    type: route.type,
                  };
                })}
              />
            ))}
            <div className="mt-6 mb-2 flex flex-row items-center justify-between">
              <h1 className="text-lg">Routes</h1>
              <button className="flex h-6 w-6 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] hover:bg-[#F2F2F2]">
                <h1 className="mb-0.5 text-xl text-[#969696]">+</h1>
              </button>
            </div>
            {data.routes.map((route: any) => (
              <Route
                key={route.id}
                id={route.id}
                name={route.name}
                type={route.type}
              />
            ))}
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        <div className="mt-6 flex h-20 w-full flex-col items-center justify-center rounded-xl border-[1.5px] border-[#E4E4E4]">
          <div className="flex">
            <h1 className="text-[#969696]">Club Compass</h1>
          </div>
          <div>
            <h1 className="text-[#969696]">v0.0.1</h1>
          </div>
        </div>
      </div>
      <div className="h-screen w-full flex-col justify-center p-8 px-24">
        <div className="flex flex-row gap-x-2">
          <h1 className="text-sm italic tracking-wider text-[#969696]">
            Index / user /
          </h1>
          <h1 className="text-sm tracking-wide text-black underline">
            createUser
          </h1>
          {/* <button
            className="rounded-md border-[1.5px] border-[#E4E4E4] py-1 px-2"
            onClick={() => {}}
          >
            Click Me
          </button> */}
        </div>
        <div className="relative ml-20" ref={parent}>
          {children}
          {/* {openComplex && (
            <ComplexModelViewer setShowComplexModelViewer={setOpenComplex} />
          )} */}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 mr-8 mb-8 flex flex-row gap-x-2">
        {!online && (
          <div className="flex flex-row items-center gap-x-2 rounded-lg bg-red-300/20 px-1.5">
            <TbWifiOff className=" h-5 w-5 text-red-400" />
            <h1 className="text-sm text-red-400">Offline</h1>
          </div>
        )}
        <div className="flex flex-row items-center gap-x-2 rounded-lg bg-green-300/20 py-1 px-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
          <h1 className="text-sm text-green-400">Pre-Alpha</h1>
        </div>
      </div>
    </div>
  );
};

export default Layout;
