import { FC, ReactNode } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Folder from "../components/Folder";
import { useQuery } from "@tanstack/react-query";
import Route from "./Route";

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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 flex-col items-center justify-center border-r-[1.5px] border-[#E4E4E4] p-8 pr-12 pb-24">
        <h1 className="mb-8 text-2xl font-medium">Scheme</h1>
        <ScrollArea.Root>
          <ScrollArea.Viewport className="h-[48rem] w-full">
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
      </div>
      <div className="h-screen w-full flex-col justify-center p-8 px-24">
        <div className="flex flex-row gap-x-2">
          <h1 className="text-sm italic tracking-wider text-[#969696]">
            Index / user /
          </h1>
          <h1 className="text-sm text-black underline">createUser</h1>
        </div>
        <div className="ml-20">{children}</div>
      </div>
      <div className="absolute bottom-0 right-0 mr-8 mb-8 flex flex-row items-center gap-x-2 rounded-lg bg-green-300/20 py-1 px-2.5">
        <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
        <h1 className="text-sm text-green-400">Pre-Alpha</h1>
      </div>
    </div>
  );
};

export default Layout;
