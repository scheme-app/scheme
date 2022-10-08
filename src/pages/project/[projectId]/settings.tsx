import type { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/future/image";
import schemeGradient from "../../../../public/scheme-gradient.svg";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { HiOutlinePlusSm } from "react-icons/hi";
import * as Separator from "@radix-ui/react-separator";
import Avatar from "boring-avatars";

const Settings: NextPage = () => {
  const router = useRouter();

  const { projectId } = router.query;

  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <div>
        <div className="mb-2 flex w-[36rem] flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-4">
            <h1 className="text-sm text-[#747474]">General</h1>
            <h1 className="text-sm text-black underline">Members</h1>
            <h1 className="text-sm text-[#747474]">Tags</h1>
          </div>
          <button className="flex flex-row items-center gap-x-0.5 text-[#747474] hover:text-black hover:underline">
            <HiOutlinePlusSm className="mb-0.5 h-3.5 w-3.5" />
            <h1 className="text-sm">Add Member</h1>
          </button>
        </div>
        <>
          <Separator.Root
            decorative
            orientation="horizontal"
            className="h-[1px] bg-[#E4E4E4]"
          />
          <div className="relative mx-1 my-4 flex flex-row items-center">
            <div className="flex flex-row items-center">
              <div className="pr-8">
                <Avatar
                  size={25}
                  name="Abhinav Palacharla"
                  variant="marble"
                  colors={[
                    "#E1EDD1",
                    "#AAB69B",
                    "#7C8569",
                    "#E8E0AE",
                    "#A4AB80",
                  ]}
                />
              </div>
              <h1 className="w-52 truncate">Abhinav Palacharla</h1>
              <h1 className="text-sm italic text-[#969696]">@palacharla</h1>
            </div>
            <button className="absolute right-0 mr-1">
              <h1 className="text-sm text-[#747474]">remove</h1>
            </button>
          </div>
        </>
        <>
          <Separator.Root
            decorative
            orientation="horizontal"
            className="h-[1px] bg-[#E4E4E4]"
          />
          <div className="relative mx-1 my-2.5 flex flex-row items-center">
            <div className="flex flex-row items-center">
              <div className="pr-8">
                <Avatar
                  size={25}
                  name="Andrew Hale"
                  variant="marble"
                  colors={[
                    "#E1EDD1",
                    "#AAB69B",
                    "#7C8569",
                    "#E8E0AE",
                    "#A4AB80",
                  ]}
                />
              </div>
              <h1 className="w-52 truncate">Andrew Hale</h1>
              <h1 className="text-sm italic text-[#969696]">@hale</h1>
            </div>
            <button className="absolute right-0 mr-1">
              <h1 className="text-sm text-[#747474]">remove</h1>
            </button>
          </div>
        </>
        <>
          <Separator.Root
            decorative
            orientation="horizontal"
            className="h-[1px] bg-[#E4E4E4]"
          />
          <div className="relative mx-1 my-2.5 flex flex-row items-center">
            <div className="flex flex-row items-center">
              <div className="pr-8">
                <Avatar
                  size={25}
                  name="Paul Bokelman"
                  variant="marble"
                  colors={[
                    "#E1EDD1",
                    "#AAB69B",
                    "#7C8569",
                    "#E8E0AE",
                    "#A4AB80",
                  ]}
                />
              </div>
              <h1 className="w-52 truncate">Paul Bokelman</h1>
              <h1 className="text-sm italic text-[#969696]">@paul.bokelman</h1>
            </div>
            <button className="absolute right-0 mr-1">
              <h1 className="text-sm text-[#747474]">remove</h1>
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  if (session.user.onboarded === false) {
    return {
      redirect: {
        destination: "/newUser",
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
}

export default Settings;
