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
import CreateRoute from "../components/CreateRoute";

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

  const { routeId, setRouteId, folder } = useContext(RouteContext);

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
      <Layout>
        {routeId === "" ? (
          <CreateRoute />
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
