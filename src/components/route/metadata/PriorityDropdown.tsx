import { FC, useContext } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/future/image";
import Priority from "../../../../public/priority.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import RouteContext from "@/context/Route.context";
import type { RoutePriority } from "@prisma/client";

type PropTypes = {
  priority: RoutePriority;
};

const PriorityItem: FC<{
  priority: { name: string; value: RoutePriority };
}> = ({ priority }) => {
  const { routeId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  const updateRoute = useMutation(
    ({ priority }: { priority: RoutePriority }) => {
      return axios.post("http://localhost:3000/api/route/update.route", {
        routeId,
        priority,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  return (
    <DropdownMenu.Item
      className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
      onClick={() => {
        updateRoute.mutate({
          priority: priority.value,
        });
      }}
    >
      <Image src={Priority} alt="priority" />
      <h1 className="text-sm text-[#969696]">{priority.name}</h1>
    </DropdownMenu.Item>
  );
};

const PriorityDropdown: FC<PropTypes> = ({ priority }) => {
  const priorities: Array<{ name: string; value: RoutePriority }> = [
    { name: "Low", value: "LOW" },
    { name: "Medium", value: "MEDIUM" },
    { name: "High", value: "HIGH" },
  ];

  return (
    <DropdownMenu.Root>
      <div>
        <h1 className="text-sm text-[#747474]">Priority</h1>
        <DropdownMenu.Trigger>
          <div className="mt-2 flex flex-row items-center gap-x-4">
            <Image src={Priority} alt="priority" />
            <h1 className="text-sm text-black">{priority}</h1>
          </div>
        </DropdownMenu.Trigger>
      </div>
      <DropdownMenu.Content className="mr-64 mt-[-2rem] w-36 rounded-md border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
        {priorities.map((priority) => {
          return <PriorityItem priority={priority} />;
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export { PriorityDropdown };
