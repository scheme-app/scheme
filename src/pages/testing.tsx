import { Formik, Form, Field } from "formik";
import Button from "../components/Button";
import type { NextPage } from "next";
import { BsFolderPlus } from "react-icons/bs";
import ProjectContext from "../context/Project.context";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Testing: NextPage = () => {
  const { project } = useContext(ProjectContext);

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

  return (
    <div className="flex h-screen items-center justify-center">
      <Formik
        initialValues={{ name: "", submit: false }}
        onSubmit={(values) => {
          if (!values.submit) {
            return;
          }
          values.submit = false;

          createFolder.mutate({ name: values.name });
        }}
      >
        {({ values }) => (
          <Form>
            <div className="rounded-xl border-[1px] border-[#E4E4E4] px-6 pt-4 pb-4 shadow-sm">
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
                {/* <Button
                  name="Save"
                  type="submit"
                  onClick={() => {
                    values.submit = true;
                  }}
                /> */}
                {/* <Button
                name="Delete"
                type="button"
                onClick={() => {
                  deleteRoute.mutate(routeId);
                  // deleteField.mutate({ fieldId });
                  // setEditRoutePopover(false);
                }}
              /> */}
                <button
                  className="rounded-md border-[1px] border-[#E4E4E4] py-0.5 px-2.5 text-sm font-light text-[#969696] hover:text-black hover:shadow-sm"
                  type="submit"
                  onClick={() => {
                    values.submit = true;
                  }}
                >
                  Save
                </button>
                <button
                  className="px-2 py-1 text-sm font-light text-[#969696] hover:text-black"
                  type="button"
                  onClick={() => {
                    // deleteRoute.mutate(routeId);
                    // deleteField.mutate({ fieldId });
                    // setEditRoutePopover(false);
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
  );
};

export default Testing;
