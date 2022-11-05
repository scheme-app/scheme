import { FC, useContext } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/future/image";
import Priority from "../../../../public/priority.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import RouteContext from "@/context/Route.context";
import type { RouteStatus } from "@prisma/client";

type PropTypes = {
  status: RouteStatus;
};

const StatusItem: FC<{
  status: { name: string; value: RouteStatus };
}> = ({ status }) => {
  const { routeId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  const updateRoute = useMutation(
    ({ status }: { status: RouteStatus }) => {
      return axios.post("http://localhost:3000/api/route/update.route", {
        routeId,
        status,
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
          status: status.value,
        });
      }}
    >
      <Image src={Priority} alt="priority" />
      <h1 className="text-sm text-[#969696]">{status.name}</h1>
    </DropdownMenu.Item>
  );
};

const StatusDropdown: FC<PropTypes> = ({ status }) => {
  const statuses: Array<{ name: string; value: RouteStatus }> = [
    { name: "Prototyping", value: "PROTOTYPING" },
    { name: "Developing", value: "DEVELOPING" },
    { name: "Complete", value: "COMPLETE" },
  ];

  return (
    <DropdownMenu.Root>
      <div>
        <h1 className="text-sm text-[#747474]">Status</h1>
        <DropdownMenu.Trigger>
          <div className="mt-2 flex flex-row items-center gap-x-4">
            <Image src={Priority} alt="priority" />
            <h1 className="text-sm text-black">{status}</h1>
          </div>
        </DropdownMenu.Trigger>
      </div>
      <DropdownMenu.Content className="mr-64 mt-[-2rem] w-36 rounded-md border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
        {statuses.map((status) => {
          return <StatusItem status={status} />;
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export { StatusDropdown };
