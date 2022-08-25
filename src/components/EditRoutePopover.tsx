import { FC, useState, useRef, useContext } from "react";
import RouteContext from "../context/Route.context";
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

type FolderSelectorPropTypes = {
  valuesFolder: folder;
  setShowFolderSelector: (value: boolean) => void;
};

type FolderPropTypes = {
  id: string;
  name: string;
  valuesFolder: {
    id: string;
    name: string;
  };
  setShowFolderSelector: (value: boolean) => void;
};

const projectId = "cl6tnc57v0025rhlpu8pnnhrd";

const getFolders = async () => {
  const response = await fetch(
    `http://localhost:3000/api/folder/get.folders?projectId=${projectId}`,
    {
      method: "GET",
    }
  );

  return response.json();
};

const Folder: FC<FolderPropTypes> = ({
  id,
  name,
  valuesFolder,
  setShowFolderSelector,
}) => {
  return (
    <button
      className="flex w-full flex-row items-center gap-x-2.5 rounded-md py-1 pl-2 hover:bg-[#F2F2F2]"
      onClick={() => {
        valuesFolder.id = id;
        valuesFolder.name = name;
        setShowFolderSelector(false);
      }}
    >
      <BsFolder className="h-5 w-5 text-[#969696]" />
      <h1 className="text-[#969696]">{name}</h1>
    </button>
  );
};

const FolderSelector: FC<FolderSelectorPropTypes> = ({
  valuesFolder,
  setShowFolderSelector,
}) => {
  const { data, status } = useQuery(["folders"], getFolders);

  const ref = useRef(null);
  useClickAway(ref, () => {
    setShowFolderSelector(false);
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div ref={ref}>
      <ScrollArea.Root>
        <ScrollArea.Viewport className="flex h-[7rem] w-[10rem] flex-col rounded-lg border-[1.5px] border-[#E4E4E4] bg-white py-2 px-2 shadow-md">
          {data.map((folder: any) => {
            return (
              <Folder
                key={folder.id}
                id={folder.id}
                name={folder.name}
                valuesFolder={valuesFolder}
                setShowFolderSelector={setShowFolderSelector}
              />
            );
          })}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </div>
  );
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

  const { routeId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  queryClient.prefetchQuery(["folders"], getFolders);

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
        queryClient.invalidateQueries(["cl6tnc57v0025rhlpu8pnnhrd"]);
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
            className="relative mt-8 mb-6 flex flex-col rounded-2xl border-[1.5px] border-[#E4E4E4] bg-white px-6 pt-4 pb-6 shadow-sm"
          >
            <div className="absolute top-0 right-0 mt-4 mr-6 flex flex-row gap-x-2">
              <h1 className="text-sm italic tracking-wider text-[#969696]">
                {`Index / ${values.folder.name + " / "}`}
              </h1>
              <h1 className="text-sm tracking-wide text-black underline">
                {values.name}
              </h1>
            </div>
            <div className="pr-40">
              <div className="mt-4">
                <h1 className="mb-2">Name</h1>
                <Field
                  name="name"
                  autoComplete="off"
                  placeholder="field name"
                  className="w-[22rem] rounded-lg border-[1.5px] border-[#E4E4E4] py-1.5 px-3 text-lg font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                />
              </div>
              <div className="mt-4 flex flex-row gap-x-10">
                <PopoverOptions
                  fieldAlias="Type"
                  fieldName="type"
                  options={[
                    { name: "GET", value: "GET" },
                    { name: "POST", value: "POST" },
                  ]}
                  defaultValue={values.type}
                />
                <div className="w-full">
                  <h1 className="mb-2">Folder</h1>
                  <div className="flex flex-row items-center justify-between rounded-lg border-[1.5px] border-[#E4E4E4] py-2 px-3">
                    <h1 className="font-light text-[#969696]">
                      {`Index / ${values.folder.name}`}
                    </h1>
                    <button
                      onClick={() => {
                        setShowFolderSelector(!showFolderSelector);
                      }}
                    >
                      <FiChevronDown className="h-5 w-5 text-[#969696]" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 right-0 mb-4 mr-4">
                    {showFolderSelector && (
                      <FolderSelector
                        valuesFolder={values.folder}
                        setShowFolderSelector={setShowFolderSelector}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-row gap-x-4">
                <Button
                  name="Save"
                  type="submit"
                  onClick={() => {
                    values.submit = true;
                  }}
                />
                <Button
                  name="Delete"
                  type="button"
                  onClick={() => {
                    // deleteField.mutate({ fieldId });
                    // setEditRoutePopover(false);
                  }}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditRoutePopover;
