import { FC } from "react";
import Avatar from "boring-avatars";

type User = {
  id: string;
  name: string;
  username: string;
};

type PropTypes = {
  owner: User;
};

const Creator: FC<PropTypes> = ({ owner }) => {
  return (
    <div>
      <h1 className="text-sm text-[#747474]">Creator</h1>
      <div className="mt-3 flex flex-row items-start gap-x-4">
        <Avatar
          size={25}
          name={owner.id}
          variant="marble"
          colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
        />
        <div>
          <h1 className="text-sm text-black">{owner.name}</h1>
          <h1 className="ml-1 text-sm text-[#969696]">@{owner.username}</h1>
        </div>
      </div>
    </div>
  );
};

export { Creator };
