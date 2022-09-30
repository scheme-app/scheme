import { FC, useState, useRef, useEffect, useContext } from "react";
import { BsFolder, BsFolder2Open } from "react-icons/bs";
import Route from "./Route";
import autoAnimate from "@formkit/auto-animate";
import { HiOutlinePlusSm } from "react-icons/hi";
import * as Popover from "@radix-ui/react-popover";
import { Formik, Form, Field } from "formik";
import Button from "./Button";
import PopoverOptions from "./PopoverOptions";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectContext from "../context/Project.context";

type PropTypes = {
  name: string;
  routes: Array<{
    id: string;
    name: string;
    type: "GET" | "POST";
  }>;
};

const Folder: FC<PropTypes> = ({ name, routes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { project, setProject } = useContext(ProjectContext);

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

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div className={`${isOpen ? "mb-2" : ""} px-2.5`}>
      <button
        className="mb-2 flex flex-row"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <BsFolder2Open className="mr-4 h-5 w-5 text-[#969696]" />
        ) : (
          <BsFolder className="mr-4 h-5 w-5 text-[#969696]" />
        )}
        <h1 className="text-sm">{name}</h1>
      </button>
      <div className="ml-4" ref={parent}>
        {isOpen && (
          <>
            {routes.map((route) => (
              <Route
                key={route.id}
                id={route.id}
                name={route.name}
                type={route.type}
              />
            ))}
            <Popover.Root>
              <Popover.Trigger className="outline-none ring-0">
                <button className="mt-2 mb-4 flex flex-row items-center gap-x-1">
                  <HiOutlinePlusSm className="h-4 w-4 text-[#969696]" />
                  <h1 className="text-sm text-[#969696]">Add Route</h1>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="ml-44 outline-none">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Folder;
