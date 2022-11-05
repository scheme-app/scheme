import { FC, useContext } from "react";
import { useRouter } from "next/router";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { HiOutlinePlusSm, HiChevronDown } from "react-icons/hi";
import Avatar from "boring-avatars";

import { SidebarFooter } from "@components/layout/sidebar";

import type { Session } from "next-auth";

import RouteContext from "@/context/Route.context";
import ProjectContext from "@/context/Project.context";

type PropTypes = {
  session: Session | null;
};

const ProjectSelector: FC<PropTypes> = ({ session }) => {
  const { setRouteId } = useContext(RouteContext);
  const { project, setProject } = useContext(ProjectContext);

  const router = useRouter();

  const { data: projectData } = useQuery(["projects"], async () => {
    const response = await axios.get(
      `http://localhost:3000/api/project/get.projects?userId=${session?.user.id}`
    );

    return response.data;
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mr-36 mb-6">
          <ScrollArea.Root>
            <ScrollArea.Viewport className="flex h-24 flex-col rounded-lg border-[1px] border-[#E4E4E4] bg-white py-2 px-2 shadow-md">
              {projectData &&
                projectData.map((project: { id: string; name: string }) => (
                  <DropdownMenu.Item
                    className="rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    key={project.id}
                  >
                    <div className="flex flex-row items-center gap-x-2">
                      <button
                        className="flex w-full flex-row items-center gap-x-4"
                        onClick={() => {
                          setRouteId("");
                          setProject({
                            id: project.id,
                            name: project.name,
                          });
                        }}
                      >
                        <Avatar
                          size={25}
                          name={project.id}
                          variant="marble"
                          colors={[
                            "#E1EDD1",
                            "#AAB69B",
                            "#7C8569",
                            "#E8E0AE",
                            "#A4AB80",
                          ]}
                        />
                        <h1 className="text-sm text-[#969696]">
                          {project.name}
                        </h1>
                      </button>
                      <button
                        className="flex h-7 w-9 items-center justify-center rounded-md text-[#969696] hover:text-black"
                        onClick={() => {
                          router.push(`/project/${project.id}/settings`);
                        }}
                      >
                        <h1 className="mb-2">...</h1>
                      </button>
                    </div>
                  </DropdownMenu.Item>
                ))}
              <button className="flex w-full flex-row items-center gap-x-2 rounded-lg p-2 hover:bg-[#F2F2F2]">
                <HiOutlinePlusSm className="h-3.5 w-3.5 text-[#969696]" />
                <h1 className="text-sm text-[#969696]">New Project</h1>
              </button>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
      <div className="fixed bottom-8">
        <div className="flex w-60 flex-row items-center justify-between rounded-lg border-[1.5px] border-[#E4E4E4] bg-white py-2 px-3">
          <Avatar
            size={25}
            name={project.id}
            variant="marble"
            colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
          />
          <h1 className="text-sm text-black">{project.name}</h1>
          <DropdownMenu.Trigger className="flex items-center justify-center outline-none">
            <HiChevronDown className="text-[#747474]" />
          </DropdownMenu.Trigger>
        </div>
        <SidebarFooter />
      </div>
    </DropdownMenu.Root>
  );
};

export { ProjectSelector };
