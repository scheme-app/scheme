import { FC, useContext } from "react";
import { Folder } from "./Folder";
import type { FolderPropTypes } from "./Folder";
import type { RoutePropTypes } from "./Route";

import * as Popover from "@radix-ui/react-popover";
import { Formik, Form, Field } from "formik";
import { BsFolderPlus } from "react-icons/bs";
import { HiOutlinePlusSm } from "react-icons/hi";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import ProjectContext from "@/context/Project.context";

type PropTypes = {
  folders: Array<FolderPropTypes>;
};

const Folders: FC<PropTypes> = ({ folders }) => {
  const queryClient = useQueryClient();

  const { project } = useContext(ProjectContext);

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

  return (
    <>
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
            <button className="flex h-5 w-5 items-center justify-center rounded-[0.3rem] border-[1.5px] border-[#E4E4E4] outline-none ring-0 hover:bg-[#F2F2F2]">
              <HiOutlinePlusSm className="h-5 w-5 text-[#969696]" />
            </button>
          </Popover.Trigger>
        </div>
      </Popover.Root>
      {folders &&
        folders.map((folder: FolderPropTypes) => (
          <Folder
            key={folder.id}
            id={folder.id}
            name={folder.name}
            routes={folder.routes.map((route: RoutePropTypes) => {
              return {
                id: route.id,
                name: route.name,
                type: route.type,
              };
            })}
          />
        ))}
    </>
  );
};

export { Folders };
