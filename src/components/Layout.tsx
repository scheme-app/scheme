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

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const { project, setProject } = useContext(ProjectContext);
  const { routeId, setRouteId } = useContext(RouteContext);

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

  const createRoute = useMutation(
    ({
      name,
      type,
      authorization,
    }: {
      name: string;
      type: "GET" | "POST";
      authorization:
        | "NONE"
        | "API_KEY"
        | "BEARER"
        | "BASIC"
        | "DIGEST"
        | "OAUTH";
    }) => {
      return axios.post("http://localhost:3000/api/route/create.route", {
        name,
        type,
        authorization,
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
      <div className="w-1/4 flex-col items-center justify-center border-r-[1px] border-[#E4E4E4] p-8 pr-12 pb-24">
        <h1 className="mb-8 text-2xl font-medium">Scheme</h1>
        <ScrollArea.Root>
          <ScrollArea.Viewport className="h-[40rem] w-full">
            <div className="mb-3 flex flex-row items-center justify-between">
              <h1 className="text-[1rem]">Folders</h1>
              {/* <button className="flex h-6 w-6 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] hover:bg-[#F2F2F2]">
                <h1 className="mb-0.5 text-xl text-[#969696]">+</h1>
              </button> */}
              <button className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] outline-none ring-0 hover:bg-[#F2F2F2]">
                {/* <h1 className="mb-0.5 text-xl text-[#969696]">+</h1> */}
                <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
              </button>
            </div>
            {data.folders &&
              data.folders.map((folder: any) => (
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
              <h1 className="text-[1rem]">Routes</h1>
              <Popover.Root>
                <Popover.Trigger>
                  <button className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] outline-none ring-0 hover:bg-[#F2F2F2]">
                    {/* <h1 className="mb-0.5 text-xl text-[#969696]">+</h1> */}
                    <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal className="">
                  <Popover.Content className="ml-60 outline-none">
                    <Formik
                      initialValues={{
                        name: "",
                        type: "GET" as "GET" | "POST",
                        authorization: "NONE" as
                          | "NONE"
                          | "API_KEY"
                          | "BEARER"
                          | "BASIC"
                          | "DIGEST"
                          | "OAUTH",
                        submit: false,
                      }}
                      onSubmit={(values) => {
                        if (!values.submit) {
                          return;
                        }
                        values.submit = false;

                        createRoute.mutate({
                          name: values.name,
                          type: values.type,
                          authorization: values.authorization,
                        });
                      }}
                    >
                      {({ values }) => (
                        <Form>
                          <div
                            role="group"
                            className="mt-2 mb-6 flex flex-col rounded-2xl border-[1.5px] border-[#E4E4E4] bg-white px-6 pt-4 pb-6 shadow-sm"
                          >
                            <div className="flex flex-row items-center gap-x-8">
                              <div>
                                <h1 className="mb-2">Name</h1>
                                <Field
                                  name="name"
                                  autoComplete="off"
                                  placeholder="Route name"
                                  className="rounded-lg border-[1.5px] border-[#E4E4E4] py-1.5 px-3 text-lg font-light focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                                />
                              </div>
                              <PopoverOptions
                                fieldAlias="Type"
                                fieldName="type"
                                options={[
                                  { name: "GET", value: "GET" },
                                  { name: "POST", value: "POST" },
                                ]}
                                defaultValue={values.type}
                              />
                            </div>
                            <div className="mt-4">
                              <PopoverOptions
                                fieldAlias="Authorization"
                                fieldName="authorization"
                                options={[
                                  { name: "None", value: "NONE" },
                                  { name: "API Key", value: "API_KEY" },
                                  { name: "Bearer", value: "BEARER" },
                                  { name: "Basic", value: "BASIC" },
                                  { name: "Digest", value: "DIGEST" },
                                  { name: "OAuth", value: "OAUTH" },
                                ]}
                                defaultValue={values.authorization}
                              />
                            </div>
                            <div className="mt-8 flex flex-row gap-x-4">
                              <Button
                                name="Create"
                                type="submit"
                                onClick={() => {
                                  values.submit = true;
                                }}
                              />
                              <Popover.Close>
                                <Button name="Cancel" type="button" />
                              </Popover.Close>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
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
                <ScrollArea.Viewport className="flex h-48 flex-col rounded-lg border-[1px] border-[#E4E4E4] bg-white py-2 px-2 shadow-md">
                  {projectData &&
                    projectData.map((project: { id: string; name: string }) => (
                      <DropdownMenu.Item
                        className="outline-none"
                        key={project.id}
                      >
                        <button
                          className="flex w-full flex-row items-center gap-x-4 rounded-lg p-2 hover:bg-[#F2F2F2]"
                          onClick={() => {
                            setRouteId("");
                            setProject({
                              id: project.id,
                              name: project.name,
                            });
                          }}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F2F2F2]">
                            <h1 className="font-semibold">
                              {(() => {
                                const tokenized = project.name.split(" ");

                                if (tokenized.length === 1) {
                                  return tokenized[0]!.charAt(0).toUpperCase();
                                } else {
                                  return (
                                    tokenized[0]!.charAt(0).toUpperCase() +
                                    tokenized[1]!.charAt(0).toUpperCase()
                                  );
                                }
                              })()}
                            </h1>
                          </div>
                          <h1 className="text-[#969696]">{project.name}</h1>
                        </button>
                      </DropdownMenu.Item>
                    ))}
                  <button className="flex w-full flex-row items-center gap-x-2 rounded-lg p-2 hover:bg-[#F2F2F2]">
                    <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
                    <h1 className="text-md text-[#969696]">New Project</h1>
                  </button>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical">
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Root>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
          <div className="mt-6 flex w-full flex-row items-center justify-between rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F2F2F2]">
              <h1 className="font-semibold">
                {(() => {
                  const tokenized = project.name.split(" ");

                  if (tokenized.length === 1) {
                    return tokenized[0]!.charAt(0).toUpperCase();
                  } else {
                    return (
                      tokenized[0]!.charAt(0).toUpperCase() +
                      tokenized[1]!.charAt(0).toUpperCase()
                    );
                  }
                })()}
              </h1>
            </div>
            <h1 className="text-[#969696]">{project.name}</h1>
            <DropdownMenu.Trigger className="flex items-center justify-center outline-none">
              <HiChevronDown />
            </DropdownMenu.Trigger>
          </div>
        </DropdownMenu.Root>
      </div>
      <div className="h-screen w-full flex-col justify-center px-24 pt-8">
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
            <DropdownMenu.Content className="mr-24 mt-4 w-36 rounded-lg border-[1px] border-[#E4E4E4] bg-white py-2 px-2 shadow-md">
              <DropdownMenu.Item
                className="flex flex-row items-center justify-between rounded-md px-2 py-1 outline-none hover:bg-[#F2F2F2]"
                onClick={() => {
                  router.push("/settings");
                }}
              >
                <h1 className="text-[#969696]">Settings</h1>
                <BsPerson className="text-[#969696]" />
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex flex-row items-center justify-between rounded-md px-2 py-1 outline-none hover:bg-[#F2F2F2]"
                onClick={() => {
                  signOut();
                }}
              >
                <h1 className="text-[#969696]">Logout</h1>
                <FiLogOut className="text-[#969696]" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="relative ml-8" ref={parent}>
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
