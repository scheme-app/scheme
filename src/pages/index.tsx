import type { NextPage } from "next";
import { useEffect } from "react";
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

const Home: NextPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
    // if (session?.user.onboarded === false) {
    //   router.push("/newUser");
    // }
  });

  const { project, setProject } = useContext(ProjectContext);

  // if (project.id === "" && session?.user?.projects[0]?.id) {
  //   setProject(session?.user?.projects[0]);
  // }

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

  const { routeId, setRouteId } = useContext(RouteContext);

  const [newRouteType, setNewRouteType] = useState<"NEW" | "IMPORT" | "NONE">(
    "NONE"
  );

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
                  onClick={() => {
                    setNewRouteType("IMPORT");
                  }}
                >
                  <h1 className="mb-8 text-xl">{"{⠀}"}</h1>
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

                    // alert(JSON.stringify(values, null, 2));

                    createRoute.mutate(
                      {
                        name: values.name,
                        type: values.type,
                        authorization: values.authorization,
                      },
                      {
                        onSuccess: ({ data }) => {
                          alert(JSON.stringify(data));
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
                              className="text-md h-[2.65rem] rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
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
              <div className="flex h-screen items-center justify-center">
                Import Route
              </div>
            )}
          </div>
        ) : status === "success" ? (
          <div className="w-[60%]">
            <RouteHeader
              name={data.name}
              type={data.type}
              folder={data.folder}
            />
            <ScrollArea.Root className="mt-8">
              <ScrollArea.Viewport className="h-[40rem] w-full">
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
                <ScrollArea.Scrollbar orientation="vertical">
                  <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </div>
        ) : (
          <div></div>
        )}
      </Layout>
    </>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

export default Home;
