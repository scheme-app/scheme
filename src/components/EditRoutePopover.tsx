import { FC, useState, useRef, useContext } from "react";
import RouteContext from "../context/Route.context";
import ProjectContext from "../context/Project.context";
import PopoverOptions from "./PopoverOptions";
import Button from "./Button";
import { Formik, Form, Field } from "formik";
import { FiChevronDown } from "react-icons/fi";
import { BsFolder } from "react-icons/bs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useClickAway } from "react-use";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type folder = {
  id: string;
  name: string;
};

type EditRoutePopoverPropTypes = {
  name: string;
  type: string;
  folder?: folder;
  setEditRoutePopover: (show: boolean) => void;
};

const EditRoutePopover: FC<EditRoutePopoverPropTypes> = ({
  name,
  type,
  folder,
  setEditRoutePopover,
}) => {
  const [showFolderSelector, setShowFolderSelector] = useState(false);

  const ref = useRef(null);
  useClickAway(ref, () => {
    setEditRoutePopover(false);
  });

  const { routeId, setRouteId } = useContext(RouteContext);
  const { project } = useContext(ProjectContext);

  const queryClient = useQueryClient();

  const updateRoute = useMutation(
    (data: {
      routeId: string;
      name: string;
      type: string;
      folderId?: string;
    }) => {
      return axios.post("http://localhost:3000/api/route/update.route", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
        queryClient.invalidateQueries([project.id]);
      },
    }
  );

  const deleteRoute = useMutation(
    (routeId: string) => {
      return axios.post("http://localhost:3000/api/route/delete.route", {
        routeId: routeId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([project.id]);
        setRouteId("");
      },
    }
  );

  return (
    <Formik
      initialValues={{
        name: name,
        type: type,
        folder: {
          id: (() => {
            return folder ? folder.id : "";
          })(),
          name: (() => {
            return folder ? folder.name : "";
          })(),
        },
        submit: false,
      }}
      onSubmit={(values) => {
        if (!values.submit) {
          return;
        }
        values.submit = false;

        updateRoute.mutate({
          routeId: routeId,
          name: values.name,
          type: values.type,
          ...(values.folder.id && { folderId: values.folder.id }),
        });
      }}
    >
      {({ values }) => (
        <Form>
          <div
            role="group"
            ref={ref}
            className="relative mb-6 mt-8 rounded-xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-4 shadow-sm"
          >
            <div className="mt-4 flex flex-row gap-x-8">
              <div>
                <h1 className="mb-2 text-sm">Name</h1>
                <Field
                  name="name"
                  autoComplete="off"
                  placeholder="field name"
                  className="text-md h-[2.15rem] rounded-[0.3rem] border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
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
            <div className="mt-6 flex flex-row gap-x-4">
              <Button
                name="Save"
                type="submit"
                onClick={() => {
                  values.submit = true;
                }}
              />
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
                className="text-md px-2 py-1 font-light text-[#969696] hover:text-red-500"
                type="button"
                onClick={() => {
                  deleteRoute.mutate(routeId);
                  // deleteField.mutate({ fieldId });
                  // setEditRoutePopover(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditRoutePopover;
