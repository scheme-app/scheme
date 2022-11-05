import { FC } from "react";
import { useRouter } from "next/router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Avatar from "boring-avatars";
import { HiChevronDown } from "react-icons/hi";
import { BsPerson } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

type PropTypes = {
  session: Session | null;
};

const TopBar: FC<PropTypes> = ({ session }) => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-row justify-between">
      <div></div>
      <DropdownMenu.Root>
        <div className="flex flex-row items-center gap-x-2">
          <Avatar
            size={25}
            name={session?.user.id}
            variant="marble"
            colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
          />
          <DropdownMenu.Trigger className="outline-none">
            <HiChevronDown className="text-[#969696]" />
          </DropdownMenu.Trigger>
        </div>
        <DropdownMenu.Content className="mr-12 mt-4 w-36 rounded-lg border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
          <DropdownMenu.Item
            className="flex flex-row items-center justify-between rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              router.push("/settings");
            }}
          >
            <h1 className="text-sm text-[#969696]">Settings</h1>
            <BsPerson className="text-[#969696]" />
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center justify-between rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              signOut();
            }}
          >
            <h1 className="text-sm text-[#969696]">Logout</h1>
            <FiLogOut className="text-[#969696]" />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export { TopBar };
