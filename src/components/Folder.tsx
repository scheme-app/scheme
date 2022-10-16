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
  const [hoverEdit, setHoverEdit] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { project } = useContext(ProjectContext);

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
    parent.current && autoAnimate(parent.current, { duration: 150 });
  }, [parent]);

  return (
    <div className={`${isOpen ? "" : ""}`}>
      <div
        className="flex h-8 flex-row items-center rounded-md px-2 hover:bg-[#F2F2F2]"
        onMouseEnter={() => {
          setHoverEdit(true);
        }}
        onMouseLeave={() => {
          setHoverEdit(showEdit);
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
        {hoverEdit && (
          <button
            className="text-[#969696] hover:text-black"
            onClick={() => {
              setShowEdit(true);
            }}
          >
            <h1 className="mb-2">...</h1>
          </button>
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

            <button className="mt-2 mb-4 flex flex-row items-center gap-x-1">
              <HiOutlinePlusSm className="h-4 w-4 text-[#969696]" />
              <h1 className="text-sm text-[#969696]">Add Route</h1>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Folder;
