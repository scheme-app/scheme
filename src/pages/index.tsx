import type { NextPage } from "next";
import { useEffect } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import RouteHeader from "../components/RouteHeader";
import { useQuery } from "@tanstack/react-query";
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

const Home: NextPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
    // if (session?.user.onboarded === false) {
    //   router.push("/newUser");
    // }
  });

  const { project, setProject } = useContext(ProjectContext);

  // if (project.id === "" && session?.user?.projects[0]?.id) {
  //   setProject(session?.user?.projects[0]);
  // }

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

  const { routeId } = useContext(RouteContext);

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

  return (
    session && (
      <>
        <Layout>
          {routeId === "" ? (
            <div className="flex h-screen items-center justify-center">
              <h1 className="mb-36 text-lg">select a route to view</h1>
            </div>
          ) : (
            <>
              <RouteHeader
                name={data.name}
                type={data.type}
                folder={data.folder}
              />
              <ScrollArea.Root className="mt-8">
                <ScrollArea.Viewport className="h-[38rem] w-full">
                  <Authorization authorization={data.authorization} />
                  <ParentModel
                    name="Arguments"
                    fields={data.models[0].fields}
                    id={data.models[0].id}
                  />
                  <ParentModel
                    name="Response"
                    fields={data.models[1].fields}
                    id={data.models[1].id}
                  />
                  <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                  <ScrollArea.Corner />
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            </>
          )}
        </Layout>
      </>
    )
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

export default Home;
