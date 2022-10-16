import { FC, ReactNode, useState, useEffect, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Folder from "../components/Folder";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Route from "./Route";
import { useNetworkState } from "react-use";
import { TbWifiOff } from "react-icons/tb";
import { HiChevronDown } from "react-icons/hi";
import autoAnimate from "@formkit/auto-animate";
import { useContext } from "react";
import ProjectContext from "../context/Project.context";
import RouteContext from "../context/Route.context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useRouter } from "next/router";
import Avatar from "boring-avatars";
import * as Popover from "@radix-ui/react-popover";
import { Formik, Form, Field } from "formik";
import Button from "./Button";
import PopoverOptions from "./PopoverOptions";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { signOut } from "next-auth/react";
import SchemeHeaderIcon from "../../public/scheme-header-icon.svg";
import Image from "next/future/image";
import SchemeMiniLogo from "../../public/scheme-mini-logo.svg";
import { BsFolderPlus } from "react-icons/bs";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const { project, setProject } = useContext(ProjectContext);
  const { routeId, setRouteId, setFolder, setNewRouteType } =
    useContext(RouteContext);

  const getProjects = async () => {
    const response = await fetch(
      `http://localhost:3000/api/project/get.projects?userId=${session?.user.id}`,
      {
        method: "GET",
      }
    );

    return response.json();
  };

  const { data: projectData, status: projectStatus } = useQuery(
    ["projects"],
    getProjects
  );

  const getProject = async () => {
    const response = await fetch(
      `http://localhost:3000/api/project/get.project?projectId=${project.id}`,
      {
        method: "GET",
      }
    );

    return response.json();
  };

  const queryClient = useQueryClient();

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

  const { data, status } = useQuery([project.id], getProject);

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
                    {/* <h1 className="mb-0.5 text-xl text-[#969696]">+</h1> */}
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
            <div className="mt-6 mb-2 flex flex-row items-center justify-between">
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
              ))}
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Viewport>
        </ScrollArea.Root>
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
                // colors={["#A4AB80", "#7C8569", "#52493A", "#E8E0AE", "#968F4B"]}
                colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
              />
              <h1 className="text-sm text-black">{project.name}</h1>
              <DropdownMenu.Trigger className="flex items-center justify-center outline-none">
                <HiChevronDown className="text-[#747474]" />
              </DropdownMenu.Trigger>
            </div>
            <div className="mt-6 flex flex-row items-center justify-between">
              <h1 className="text-xs text-[#969696]">
                Scheme v1.0 — Private Alpha
              </h1>
              <Image src={SchemeMiniLogo} className="h-[1.1rem] w-[1.1rem]" />
            </div>
          </div>
        </DropdownMenu.Root>
      </div>
      <div className="h-screen w-full flex-col justify-center pl-24 pr-12 pt-8">
        <div className="flex w-full flex-row justify-between">
          <div></div>
          {/* <div className="flex flex-row gap-x-2">
            <h1 className="text-sm italic tracking-wider text-[#969696]">
              Index / user /
            </h1>
            <h1 className="text-sm tracking-wide text-black underline">
              createUser
            </h1>
          </div> */}
          <DropdownMenu.Root>
            <div className="flex flex-row items-center gap-x-2">
              <Avatar
                size={25}
                name={session?.user.id}
                variant="marble"
                // colors={["#A4AB80", "#7C8569", "#52493A", "#E8E0AE", "#968F4B"]}
                colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
              />
              {/* <h1 className="text-md text-black">{session?.user.name}</h1> */}
              <DropdownMenu.Trigger className="outline-none">
                <HiChevronDown className="text-[#969696]" />
              </DropdownMenu.Trigger>
            </div>
            <DropdownMenu.Content className="mr-12 mt-4 w-36 rounded-lg border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
              <DropdownMenu.Item
                className="flex flex-row items-center justify-between rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                onClick={() => {
                  router.push("/settings");
                }}
              >
                <h1 className="text-sm text-[#969696]">Settings</h1>
                <BsPerson className="text-[#969696]" />
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex flex-row items-center justify-between rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                onClick={() => {
                  signOut();
                }}
              >
                <h1 className="text-sm text-[#969696]">Logout</h1>
                <FiLogOut className="text-[#969696]" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="" ref={parent}>
          {children}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 mr-8 mb-8 flex flex-row gap-x-2">
        {!online && (
          <div className="flex flex-row items-center gap-x-2 rounded-lg bg-red-300/20 px-1.5">
            <TbWifiOff className=" h-5 w-5 text-red-400" />
            <h1 className="text-sm text-red-400">Offline</h1>
          </div>
        )}
        {/* <div className="flex flex-row items-center gap-x-2 rounded-lg bg-green-300/20 py-1 px-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
          <h1 className="text-sm text-green-400">Pre-Alpha</h1>
        </div> */}
      </div>
    </div>
  );
};

// export async function getServerSideProps(context: any) {
//   return {
//     props: {
//       session: await unstable_getServerSession(
//         context.req,
//         context.res,
//         authOptions
//       ),
//     },
//   };
// }

export default Layout;
