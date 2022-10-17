import type { NextPage } from "next";
import { useEffect, FormEvent, useRef } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RouteHeader from "../components/RouteHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ParentModel from "../components/ParentModel";
import Authorization from "../components/Authorization";
import Layout from "../components/Layout";
import { useContext } from "react";
import RouteContext from "../context/Route.context";
import ProjectContext from "../context/Project.context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState } from "react";
import { BsFileEarmarkPlus } from "react-icons/bs";
import Button from "../components/Button";
import PopoverOptions from "../components/PopoverOptions";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import Priority from "../../public/priority.svg";
import Image from "next/future/image";
import { FiChevronDown } from "react-icons/fi";
import Avatar from "boring-avatars";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HiOutlinePlusSm } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import { useClickAway } from "react-use";
import RouteUser from "../components/RouteUser";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const { project, setProject } = useContext(ProjectContext);
  const [addMembers, setAddMembers] = useState(false);
  const [username, setUsername] = useState("");

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

  if (project.id === "" && projectData) {
    setProject(projectData[0]);
  }

  const { routeId, setRouteId, newRouteType, setNewRouteType, folder } =
    useContext(RouteContext);

  const queryClient = useQueryClient();

  const createRoute = useMutation(
    ({
      name,
      type,
      authorization,
      folderId,
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
      folderId?: string;
    }) => {
      return axios.post("http://localhost:3000/api/route/create.route", {
        name,
        type,
        authorization,
        projectId: project.id,
        folderId: folder.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([project.id]);
      },
    }
  );

  const getRoute = async () => {
    const response = await fetch(
      `http://localhost:3000/api/route/get.route?routeId=${routeId}`,
      {
        method: "GET",
      }
    );

    return response.json();
  };

  const { data, status } = useQuery([routeId], getRoute, {
    enabled: project.id !== "",
  });

  const updateRoute = useMutation(
    ({
      status,
      priority,
    }: {
      status?: "PROTOTYPING" | "DEVELOPING" | "COMPLETE";
      priority?: "LOW" | "MEDIUM" | "HIGH";
    }) => {
      return axios.post("http://localhost:3000/api/route/update.route", {
        routeId,
        status,
        priority,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  const getUser = async (username: string) => {
    const response = await axios.get(`/api/user/get.user?username=${username}`);

    return response.data;
  };

  const { data: userData, status: userStatus } = useQuery(
    ["user", username],
    () => getUser(username),
    {
      enabled: !!username,
      retry: true,
    }
  );

  const assignMember = useMutation(
    ({ username }: { username: string }) => {
      return axios.post("http://localhost:3000/api/route/assignMember.route", {
        username: username,
        routeId: routeId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  const ref = useRef(null);
  useClickAway(ref, () => {
    setAddMembers(false);
  });

  return (
    <>
      <Layout>
        {routeId === "" ? (
          <div className="flex h-screen items-center justify-center">
            {/* <h1 className="mb-36 text-lg">select a route to view</h1> */}
            {newRouteType === "NONE" ? (
              <div className="mb-36 flex flex-row gap-x-8">
                <button
                  className="flex h-48 w-48 flex-col items-center justify-center rounded-xl border-[1px] border-[#E4E4E4] hover:bg-[#F2F2F2]"
                  onClick={() => {
                    setNewRouteType("NEW");
                  }}
                >
                  <BsFileEarmarkPlus className="mb-8 h-6 w-6 text-black" />
                  <h1 className="text-sm text-[#747474]">New Route</h1>
                </button>
                <button
                  className="flex h-48 w-48 flex-col items-center justify-center rounded-xl border-[1px] border-[#E4E4E4] hover:bg-[#F2F2F2]"
                  // onClick={() => {
                  //   setNewRouteType("IMPORT");
                  // }}
                  // come back later
                >
                  <h1 className="mb-8 text-xl font-light">{"{ }"}</h1>
                  <h1 className="text-sm text-[#747474]">Import Route</h1>
                </button>
              </div>
            ) : newRouteType === "NEW" ? (
              <div className="flex h-screen items-center justify-center">
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

                    createRoute.mutate(
                      {
                        name: values.name,
                        type: values.type,
                        authorization: values.authorization,
                      },
                      {
                        onSuccess: ({ data }) => {
                          setRouteId(data.id);
                        },
                      }
                    );
                  }}
                >
                  {({ values }) => (
                    <Form>
                      <div
                        role="group"
                        className="mt-2 mb-6 flex flex-col rounded-2xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-6 shadow-sm"
                      >
                        <div className="flex flex-row items-center gap-x-8">
                          <div>
                            <h1 className="mb-2 text-sm">Name</h1>
                            <Field
                              name="name"
                              autoComplete="off"
                              placeholder="Route name"
                              className="text-md h-[2.15rem] rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
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
                          <button
                            className="text-md px-2 py-1 font-light text-[#969696] hover:text-black"
                            type="button"
                            onClick={() => {
                              setNewRouteType("NONE");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <div className="flex h-screen flex-col items-center justify-center">
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
                    arguments: "",
                    submit: false,
                  }}
                  onSubmit={(values) => {
                    if (!values.submit) {
                      return;
                    }
                    values.submit = false;

                    // alert(JSON.stringify(values, null, 2));

                    createRoute.mutate(
                      {
                        name: values.name,
                        type: values.type,
                        authorization: values.authorization,
                      },
                      {
                        onSuccess: ({ data }) => {
                          setRouteId(data.id);
                        },
                      }
                    );
                  }}
                >
                  {({ values }) => (
                    <Form>
                      <div
                        role="group"
                        className="mt-2 mb-6 flex flex-col rounded-2xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-6 shadow-sm"
                      >
                        <div className="flex flex-row items-center gap-x-8">
                          <div>
                            <h1 className="mb-2 text-sm">Name</h1>
                            <Field
                              name="name"
                              autoComplete="off"
                              placeholder="Route name"
                              className="text-md h-[2.15rem] rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
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
                        <div className="mt-4 w-[26.5rem]">
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
                          <button
                            className="text-md px-2 py-1 font-light text-[#969696] hover:text-black"
                            type="button"
                            onClick={() => {
                              setNewRouteType("NONE");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div role="group" className="flex flex-row gap-x-8">
                        <div>
                          <h1 className="mb-2 text-sm">Arguments</h1>
                          <Field
                            as="textarea"
                            name="arguments"
                            autoComplete="off"
                            placeholder="json data here"
                            className="text-md h-[24rem] w-[24rem] rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                          />
                        </div>
                        <div>
                          <h1 className="mb-2 text-sm">Parsed JSON</h1>
                          <div className="h-[24rem] w-[24rem] rounded-lg border-[1px] border-[#E4E4E4]">
                            {}/////
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        ) : status === "success" ? (
          <div className="mt-24 flex flex-row gap-x-24">
            {/* <h1>{JSON.stringify(data.owner)}</h1> */}
            <div className="w-[65%]">
              <RouteHeader
                name={data.name}
                type={data.type}
                folder={data.folder}
              />
              <ScrollArea.Root className="mt-8">
                <ScrollArea.Viewport className="h-[44rem] w-full">
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
                  <div className="py-8"></div>
                  <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Corner />
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            </div>
            <div className="flex flex-col gap-y-8 border-l-[1px] border-[#E4E4E4] pl-8 pt-8">
              <DropdownMenu.Root>
                <div>
                  <h1 className="text-sm text-[#747474]">Status</h1>
                  <DropdownMenu.Trigger>
                    <div className="mt-2 flex flex-row items-center gap-x-4">
                      <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
                      <h1 className="text-sm text-black">{data.status}</h1>

                      {/* <FiChevronDown className="ml-2 h-3.5 w-3.5 text-[#969696]" /> */}
                    </div>
                  </DropdownMenu.Trigger>
                </div>
                <DropdownMenu.Content className="mr-72 mt-[-2rem] w-40 rounded-md border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
                  <DropdownMenu.Item
                    className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // router.push("/settings");
                      updateRoute.mutate({
                        status: "PROTOTYPING",
                      });
                    }}
                  >
                    <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
                    <h1 className="text-sm text-[#969696]">Prototyping</h1>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // router.push("/settings");
                      updateRoute.mutate({
                        status: "DEVELOPING",
                      });
                    }}
                  >
                    <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
                    <h1 className="text-sm text-[#969696]">Development</h1>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // router.push("/settings");
                      updateRoute.mutate({
                        status: "COMPLETE",
                      });
                    }}
                  >
                    <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
                    <h1 className="text-sm text-[#969696]">Complete</h1>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <DropdownMenu.Root>
                <div>
                  <h1 className="text-sm text-[#747474]">Priority</h1>
                  <DropdownMenu.Trigger>
                    <div className="mt-2 flex flex-row items-center gap-x-4">
                      {/* <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" /> */}
                      <Image src={Priority} alt="priority" />
                      <h1 className="text-sm text-black">{data.priority}</h1>
                    </div>
                  </DropdownMenu.Trigger>
                </div>
                <DropdownMenu.Content className="mr-64 mt-[-2rem] w-36 rounded-md border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
                  <DropdownMenu.Item
                    className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // router.push("/settings");
                      updateRoute.mutate({
                        priority: "LOW",
                      });
                    }}
                  >
                    <Image src={Priority} alt="priority" />
                    <h1 className="text-sm text-[#969696]">Low</h1>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // router.push("/settings");
                      updateRoute.mutate({
                        priority: "MEDIUM",
                      });
                    }}
                  >
                    <Image src={Priority} alt="priority" />
                    <h1 className="text-sm text-[#969696]">Medium</h1>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
                    onClick={() => {
                      // router.push("/settings");
                      updateRoute.mutate({
                        priority: "HIGH",
                      });
                    }}
                  >
                    <Image src={Priority} alt="priority" />
                    <h1 className="text-sm text-[#969696]">High</h1>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              {data.owner && (
                <div>
                  <h1 className="text-sm text-[#747474]">Creator</h1>
                  <div className="mt-3 flex flex-row items-start gap-x-4">
                    {/* <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" /> */}
                    {/* <Image src={Priority} alt="priority" /> */}
                    <Avatar
                      size={25}
                      name={data.owner.id}
                      variant="marble"
                      colors={[
                        "#E1EDD1",
                        "#AAB69B",
                        "#7C8569",
                        "#E8E0AE",
                        "#A4AB80",
                      ]}
                    />
                    <div>
                      <h1 className="text-sm text-black">{data.owner.name}</h1>
                      <h1 className="ml-1 text-sm text-[#969696]">
                        @{data.owner.username}
                      </h1>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-sm text-[#747474]">Assigned To</h1>
                {data.assignedTo.map(
                  (user: { id: string; name: string; username: string }) => (
                    <RouteUser
                      id={user.id}
                      name={user.name}
                      username={user.username}
                    />
                  )
                )}
                {addMembers ? (
                  <Formik
                    initialValues={{
                      submit: false,
                      username: "",
                    }}
                    onSubmit={async (values) => {
                      if (!values.submit) {
                        return;
                      }
                      values.submit = false;

                      assignMember.mutate(
                        {
                          username: values.username.replace("@", ""),
                        },
                        {
                          onSuccess: () => {
                            setUsername("");
                            setAddMembers(false);
                          },
                        }
                      );
                    }}
                  >
                    {({ values }) => (
                      <Form
                        onChange={(event: FormEvent) => {
                          setUsername(
                            (event.target as HTMLTextAreaElement).value.replace(
                              "@",
                              ""
                            )
                          );
                        }}
                      >
                        <div
                          className="mt-4 flex flex-row items-center gap-x-2"
                          ref={ref}
                        >
                          <div className="flex h-[2.25rem] flex-row items-center gap-x-2 rounded-lg border-[1px] border-[#E4E4E4] px-2">
                            {userData && (
                              <Avatar
                                size={25}
                                name={userData.id}
                                variant="marble"
                                colors={[
                                  "#E1EDD1",
                                  "#AAB69B",
                                  "#7C8569",
                                  "#E8E0AE",
                                  "#A4AB80",
                                ]}
                              />
                            )}
                            <Field
                              name="username"
                              autoComplete="off"
                              placeholder="@username"
                              className="w-28 text-sm font-light focus:outline-none"
                            />
                            {data.assignedTo.map(
                              (user: {
                                id: string;
                                name: string;
                                username: string;
                              }) => {
                                if (user.username === username) {
                                  return (
                                    <MdOutlineErrorOutline className="h-5 w-5 text-red-500" />
                                  );
                                }
                              }
                            )}
                          </div>
                          {userData &&
                            !data.assignedTo.find(
                              (user: { id: string }) => user.id === userData.id
                            ) && (
                              <button
                                className="flex items-center justify-center"
                                type="submit"
                                onClick={() => {
                                  values.submit = true;
                                }}
                              >
                                <BsArrowRightShort className="h-6 w-6 pt-1 text-[#747474] hover:text-black" />
                              </button>
                            )}
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <button
                    className="mt-4 w-min"
                    onClick={() => {
                      setAddMembers(true);
                    }}
                  >
                    <div className="flex flex-row items-center gap-x-1 text-[#969696] hover:text-black">
                      <HiOutlinePlusSm className="h-3 w-3" />
                      <h1 className="w-max text-sm">Assign Member</h1>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </Layout>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  if (session.user.onboarded === false) {
    return {
      redirect: {
        destination: "/newUser",
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
}

export default Home;
