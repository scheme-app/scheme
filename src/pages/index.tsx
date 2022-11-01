import type { GetServerSideProps, NextPage } from "next";
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
import Head from "next/head";
import RouteData from "../components/RouteData";
import RouteMetaData from "../components/RouteMetaData";

const Home: NextPage<{ routeIdProp: string }> = ({ routeIdProp }) => {
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
    const response = await axios.get(
      `/api/user/get.user?username=${username}&projectId=${project.id}`
      // `/api/user/get.user?username=${username}`
    );

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

  useEffect(() => {
    if (routeIdProp !== "") {
      setRouteId(routeIdProp);
      routeIdProp = "";
    }
  }, []);

  return (
    <>
      <Head>
        <meta property="og:title" content="View Route on Scheme" />
        <meta
          property="og:image"
          content={`http://localhost:3000/api/og?routeId=${"cl90o0b6p063137lp5ki24ecc"}`}
        />
        {/* <title>Hello There.</title> */}
      </Head>
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
            <RouteData
              id={data.id}
              name={data.name}
              type={data.type}
              authorization={data.authorization}
              models={data.models}
            />
            <RouteMetaData
              projectId={project.id}
              routeId={routeId}
              status={data.status}
              priority={data.priority}
              owner={data.owner}
              assignedTo={data.assignedTo}
            />
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

  const { routeId } = context.query;

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
      routeIdProp: routeId || "",
      session: session,
    },
  };
}

export default Home;
