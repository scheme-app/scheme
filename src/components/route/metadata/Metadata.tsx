import { FC } from "react";
import { RouteStatus, RoutePriority } from "@prisma/client";
import { User } from "./User";
import { AssignedTo } from "./AssignedTo";
import { Creator } from "./Creator";
import { PriorityDropdown } from "./PriorityDropdown";
import { StatusDropdown } from "./StatusDropdown";

type User = {
  id: string;
  name: string;
  username: string;
};

type PropTypes = {
  status: RouteStatus;
  priority: RoutePriority;
  owner: User;
  assignedTo: Array<User>;
};

const Metadata: FC<PropTypes> = ({ status, priority, owner, assignedTo }) => {
  return (
    <div className="flex flex-col gap-y-8 border-l-[1px] border-[#E4E4E4] pl-8 pt-8">
      <StatusDropdown status={status} />
      <PriorityDropdown priority={priority} />
      <Creator owner={owner} />
      <AssignedTo assignedTo={assignedTo} />
    </div>
  );
};

export { Metadata };
