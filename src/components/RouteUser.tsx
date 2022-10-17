import { FC, useState, useContext } from "react";
import Avatar from "boring-avatars";
import { CgRemove } from "react-icons/cg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RouteContext from "../context/Route.context";
import axios from "axios";

const RouteUser: FC<{
  id: string;
  name: string;
  username: string;
}> = ({ id, name, username }) => {
  const [userHover, setUserHover] = useState(false);
  const { routeId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  const removeUser = useMutation(
    ({ username }: { username: string }) => {
      return axios.post("http://localhost:3000/api/route/removeMember.route", {
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
        {/* <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" /> */}
        {/* <Image src={Priority} alt="priority" /> */}
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

export default RouteUser;
