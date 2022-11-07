import { FC, ReactNode, useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import autoAnimate from "@formkit/auto-animate";
import { useContext } from "react";
import ProjectContext from "@/context/Project.context";
import { useSession } from "next-auth/react";
import { TopBar } from "@components/layout/TopBar";
import { ProjectSelector } from "@components/layout/sidebar/ProjectSelector";
import { Folders } from "@components/layout/sidebar/Folders";
import { Routes } from "@components/layout/sidebar/Routes";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  const { project, setProject } = useContext(ProjectContext);

  const { data: projectData } = useQuery(["projects"], async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/project/get.projects?userId=${session?.user.id}`
    );

    return response.data;
  });

  if (project.id === "" && projectData) {
    setProject(projectData[0]);
  }

  const { data, status } = useQuery([project.id], async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/project/get.project?projectId=${project.id}`
    );

    return response.data;
  });

  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 200,
        easing: "ease-in-out",
      });
  }, [parent]);

  return status === "loading" ? (
    <></> //implement loading state
  ) : (
    <div className="flex h-screen overflow-hidden">
      <div className="relative w-[24rem] flex-col items-center justify-center border-r-[1px] border-[#E4E4E4] p-8">
        <ScrollArea.Root>
          <ScrollArea.Viewport className="h-[43.5rem] w-full">
            <Folders folders={data.folders} />
            <Routes routes={data.routes} />
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Viewport>
        </ScrollArea.Root>
        <ProjectSelector session={session} />
      </div>
      <div className="w-full flex-col justify-center pl-24 pr-12 pt-8">
        <TopBar session={session} />
        <div className="" ref={parent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { Layout };
