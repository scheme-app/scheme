import { FC, useState, useContext } from "react";
import Avatar from "boring-avatars";
import { CgRemove } from "react-icons/cg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RouteContext from "@/context/Route.context";
import axios from "axios";

const User: FC<{
  id: string;
  name: string;
  username: string;
}> = ({ id, name, username }) => {
  const [userHover, setUserHover] = useState(false);
  const { routeId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  const removeUser = useMutation(
    ({ username }: { username: string }) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/route/removeMember.route`,
        {
          username: username,
          routeId: routeId,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  return (
    <div
      className="mt-3 flex flex-row"
      onMouseEnter={() => {
        setUserHover(true);
      }}
      onMouseLeave={() => {
        setUserHover(false);
      }}
    >
      <div className="flex w-44 flex-row gap-x-4">
        <Avatar
          size={25}
          name={id}
          variant="marble"
          colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
        />
        <div>
          <h1 className="text-sm text-black">{name}</h1>
          <h1 className="ml-1 text-sm text-[#969696]">@{username}</h1>
        </div>
      </div>
      {userHover ? (
        <button
          className="p-3 text-[#969696] hover:text-red-500"
          onClick={() => {
            removeUser.mutate({ username: username });
          }}
        >
          <CgRemove />
        </button>
      ) : (
        <div className="p-3"></div>
      )}
    </div>
  );
};

export { User };
