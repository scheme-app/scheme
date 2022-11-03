import { FC, useState, useRef, useEffect, useContext } from "react";
import { BsFolder, BsFolder2Open } from "react-icons/bs";
import Route from "./Route_sidebar";
import autoAnimate from "@formkit/auto-animate";
import { HiOutlinePlusSm } from "react-icons/hi";
import * as Popover from "@radix-ui/react-popover";
import { Formik, Form, Field } from "formik";
import Button from "./Button";
import PopoverOptions from "./PopoverOptions";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectContext from "../context/Project.context";
import RouteContext from "../context/Route.context";
import { BsFolderPlus } from "react-icons/bs";

type PropTypes = {
  id: string;
  name: string;
  routes: Array<{
    id: string;
    name: string;
    type: "GET" | "POST";
  }>;
};

const Folder: FC<PropTypes> = ({ id, name, routes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { project } = useContext(ProjectContext);
  const { routeId, setRouteId, setNewRouteType, setFolder } =
    useContext(RouteContext);

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

  const editFolder = useMutation(
    ({ name }: { name: string }) => {
      return axios.post("http://localhost:3000/api/folder/edit.folder", {
        name,
        folderId: id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([project.id]);
      },
    }
  );

  const deleteFolder = useMutation(
    () => {
      return axios.post("http://localhost:3000/api/folder/delete.folder", {
        folderId: id,
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
    parent.current && autoAnimate(parent.current, { duration: 150 });
  }, [parent]);

  return (
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

              editFolder.mutate({ name: values.name });
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
                      placeholder={name}
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
                      Save
                    </button>
                    <Popover.Close>
                      <button
                        className="px-2 py-1 text-sm font-light text-[#969696] hover:text-red-500"
                        type="button"
                        onClick={() => {
                          setShowEdit(false);
                          if (routes.map((route) => route.id === routeId)) {
                            setRouteId("");
                          }
                          deleteFolder.mutate();
                        }}
                      >
                        Delete
                      </button>
                    </Popover.Close>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Popover.Content>
      </Popover.Portal>
      <div className={`${isOpen ? "" : ""}`}>
        <div
          className="flex h-8 flex-row items-center rounded-md px-2 hover:bg-[#F2F2F2]"
          onMouseEnter={() => {
            setHoverEdit(true);
          }}
          onMouseLeave={() => {
            (!showEdit || !isOpen) && setHoverEdit(false);
          }}
        >
          <button
            className="flex flex-row items-center"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <BsFolder2Open className="mr-6 h-5 w-5 text-[#969696]" />
            ) : (
              <BsFolder className="mr-6 h-5 w-5 text-[#969696]" />
            )}
            <h1 className="flex w-44 flex-row justify-start truncate text-sm">
              {name}
            </h1>
          </button>
          {(hoverEdit || isOpen || showEdit) && (
            <Popover.Trigger>
              <button
                className="text-[#969696] hover:text-black"
                onClick={() => {
                  setShowEdit(true);
                }}
              >
                <h1 className="mb-2">...</h1>
              </button>
            </Popover.Trigger>
          )}
        </div>
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

              <button
                className="mt-2 mb-4 flex flex-row items-center gap-x-1"
                onClick={() => {
                  setRouteId("");
                  setFolder({ id: id, name: name });
                  setNewRouteType("NONE");
                }}
              >
                <HiOutlinePlusSm className="h-4 w-4 text-[#969696]" />
                <h1 className="text-sm text-[#969696]">Add Route</h1>
              </button>
            </>
          )}
        </div>
      </div>
    </Popover.Root>
  );
};

export default Folder;
