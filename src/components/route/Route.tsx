import { FC } from "react";
import { RouteData } from "./Route.Data";
import { Metadata } from "./metadata";

import type {
  RouteType,
  AuthorizationType,
  RouteStatus,
  RoutePriority,
} from "@prisma/client";
import type { ModelPropTypes } from "./Model";

type User = {
  id: string;
  name: string;
  username: string;
};

type PropTypes = {
  routeData: {
    id: string;
    name: string;
    type: RouteType;
    authorization: AuthorizationType;
    models: Array<ModelPropTypes>;
    status: RouteStatus;
    priority: RoutePriority;
    owner: User;
    assignedTo: Array<User>;
  };
  projectId: string;
};

const Route: FC<PropTypes> = ({ routeData: data, projectId }) => {
  return (
    <div className="mt-24 flex flex-row gap-x-24">
      <RouteData
        id={data.id}
        name={data.name}
        type={data.type}
        authorization={data.authorization}
        models={data.models}
      />
      <Metadata
        projectId={projectId}
        routeId={data.id}
        status={data.status}
        priority={data.priority}
        owner={data.owner}
        assignedTo={data.assignedTo}
      />
    </div>
  );
};

export { Route };
