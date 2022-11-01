import type { NextPage } from "next";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { useContext } from "react";
import RouteContext from "../context/Route.context";
import ProjectContext from "../context/Project.context";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import RouteData from "../components/RouteData";
import RouteMetaData from "../components/RouteMetaData";
import CreateRoute from "../components/CreateRoute";
import axios from "axios";

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

const Home: NextPage<{ routeIdProp: string }> = ({ routeIdProp }) => {
  const { data: session } = useSession();

  const { project, setProject } = useContext(ProjectContext);

  const { data: projectData, status: projectStatus } = useQuery(
    ["projects"],
    async () => {
      const response = await axios.get(
        `http://localhost:3000/api/project/get.projects?userId=${session?.user.id}`
      );

      return response.data;
    }
  );

  if (project.id === "" && projectData) {
    setProject(projectData[0]);
  }

  const { routeId, setRouteId } = useContext(RouteContext);

  const { data, status } = useQuery(
    [routeId],
    async () => {
      const response = await axios.get(
        `http://localhost:3000/api/route/get.route?routeId=${routeId}`
      );

      return response.data;
    },
    {
      enabled: project.id !== "",
    }
  );

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

export default Home;
