import { FC, ReactNode, useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Folder from "./Folder";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Route from "./Route_sidebar";
import autoAnimate from "@formkit/auto-animate";
import { useContext } from "react";
import ProjectContext from "../context/Project.context";
import RouteContext from "../context/Route.context";
import { useSession } from "next-auth/react";
import * as Popover from "@radix-ui/react-popover";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { BsFolderPlus } from "react-icons/bs";
import { TopBar } from "@components/layout/TopBar";
import { ProjectSelector } from "@components/layout/sidebar/ProjectSelector";
import { Routes } from "@components/layout/sidebar/Routes";

import { HiOutlinePlusSm } from "react-icons/hi";

const LayoutTmp: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  const { project, setProject } = useContext(ProjectContext);

  const queryClient = useQueryClient();

  const { data: projectData } = useQuery(["projects"], async () => {
    const response = await axios.get(
      `http://localhost:3000/api/project/get.projects?userId=${session?.user.id}`
    );

    return response.data;
  });

  if (project.id === "" && projectData) {
    setProject(projectData[0]);
  }

  const { data, status } = useQuery([project.id], async () => {
    const response = await axios.get(
      `http://localhost:3000/api/project/get.project?projectId=${project.id}`
    );

    return response.data;
  });

  const createFolder = useMutation(
    ({ name }: { name: string }) => {
      return axios.post("http://localhost:3000/api/folder/create.folder", {
        name,
        projectId: project.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([project.id]);
      },
    }
  );

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
            <Popover.Root>
              <Popover.Portal>
                <Popover.Content className="mt-6 ml-60">
                  <Formik
                    initialValues={{ name: "", submit: false }}
                    onSubmit={(values) => {
                      if (!values.submit) {
                        return;
                      }
                      values.submit = false;

                      createFolder.mutate(
                        { name: values.name },
                        {
                          onSuccess: () => {
                            return Popover.Close;
                          },
                        }
                      );
                    }}
                  >
                    {({ values }) => (
                      <Form>
                        <div className="rounded-[0.6rem] border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-4 shadow-sm">
                          <div>
                            <div className="flex flex-row items-center gap-x-2">
                              <BsFolderPlus className="mb-2 h-4 w-4 text-black" />
                              <h1 className="mb-2 text-sm">Folder Name</h1>
                            </div>
                            <Field
                              name="name"
                              autoComplete="off"
                              placeholder="folder name"
                              className="text-md mr-8 h-[2.15rem] rounded-[0.4rem] border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                            />
                          </div>
                          <div className="mt-6 flex flex-row gap-x-1">
                            <button
                              className="rounded-md border-[1px] border-[#E4E4E4] py-0.5 px-2 text-sm font-light text-[#969696] hover:text-black hover:shadow-sm"
                              type="submit"
                              onClick={() => {
                                values.submit = true;
                              }}
                            >
                              Create
                            </button>
                            <Popover.Close>
                              <button
                                className="px-2 py-1 text-sm font-light text-[#969696] hover:text-black"
                                type="button"
                                onClick={() => {}}
                              >
                                Cancel
                              </button>
                            </Popover.Close>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Popover.Content>
              </Popover.Portal>
              <div className="mb-3 flex flex-row items-center justify-between">
                <h1 className="text-[1rem]">Folders</h1>
                <Popover.Trigger>
                  <button
                    className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] outline-none ring-0 hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // setCreateFolder(true);
                    }}
                  >
                    <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
                  </button>
                </Popover.Trigger>
              </div>
            </Popover.Root>
            {data.folders &&
              data.folders.map((folder: any) => (
                <Folder
                  key={folder.id}
                  id={folder.id}
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
            {/* <div className="mt-6 mb-2 flex flex-row items-center justify-between">
              <h1 className="text-[1rem]">Routes</h1>
              <button
                className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] outline-none ring-0 hover:bg-[#F2F2F2]"
                onClick={() => {
                  setNewRouteType("NONE");
                  setFolder({ id: "", name: "" });
                  setRouteId("");
                }}
              >
                <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
              </button>
            </div>
            {data.routes &&
              data.routes.map((route: any) => (
                <Route
                  key={route.id}
                  id={route.id}
                  name={route.name}
                  type={route.type}
                />
              ))} */}
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

export default LayoutTmp;
