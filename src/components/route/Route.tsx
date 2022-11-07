import { FC, useContext } from "react";
import { RouteData } from "./Route.Data";
import { Metadata } from "./metadata";
import RouteContext from "@/context/Route.context";
import ProjectContext from "@/context/Project.context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Route: FC = () => {
  const { routeId } = useContext(RouteContext);
  const { project } = useContext(ProjectContext);

  const { data, status } = useQuery(
    [routeId],
    async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/route/get.route?routeId=${routeId}`
      );

      return response.data;
    },
    {
      enabled: project.id !== "",
    }
  );

  return status === "loading" ? (
    <div></div> //implement loading state
  ) : (
    <div className="mt-16 flex flex-row gap-x-24">
      <RouteData
        id={data.id}
        name={data.name}
        type={data.type}
        authorization={data.authorization}
        models={data.models}
      />
      <Metadata
        status={data.status}
        priority={data.priority}
        owner={data.owner}
        assignedTo={data.assignedTo}
      />
    </div>
  );
};

export { Route };
