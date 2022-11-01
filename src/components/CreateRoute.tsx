import { FC, useContext } from "react";
import { Formik, Form, Field } from "formik";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProjectContext from "../context/Project.context";
import RouteContext from "../context/Route.context";
import PopoverOptions from "./PopoverOptions";
import Button from "./Button";

const CreateRoute: FC = () => {
  const { project, setProject } = useContext(ProjectContext);
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

  return (
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
  );
};

export default CreateRoute;
