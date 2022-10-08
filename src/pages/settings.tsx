import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import * as Separator from "@radix-ui/react-separator";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { IoCopyOutline } from "react-icons/io5";
import { useCopyToClipboard } from "react-use";
import { BsArrowReturnRight } from "react-icons/bs";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/future/image";
import schemeGradient from "../../public/scheme-gradient.svg";

const Settings: NextPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push("/api/auth/signin");
    }

    if (session?.user.onboarded === false) {
      router.push("/newUser");
    }
  });

  const getTokens = async () => {
    const response = await fetch(
      `http://localhost:3000/api/user/getTokens.user?userId=${session?.user.id}`,
      {
        method: "GET",
      }
    );

    return response.json();
  };

  const { data, status } = useQuery([session?.user.id], getTokens);

  const [state, copyToClipboard] = useCopyToClipboard();

  return (
    session && (
      <div className="flex h-screen flex-row items-center justify-center gap-x-48">
        <div className="flex flex-col">
          <div>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <h1 className="text-3xl font-light italic">
                  Pragmatic API design
                </h1>
                <h1 className="text-3xl font-light">for developers & teams</h1>
              </div>
              <h1 className="w-[26rem] text-sm text-[#969696]">
                A barebones service to map out and document your service&apos;s
                API enpoints for internal and external use.
              </h1>
            </div>
            <div className="mt-16">
              <div className="mt-4 flex flex-row gap-x-16">
                <div className="flex flex-col gap-y-6">
                  <h1 className="text-sm text-[#969696]">Avatar</h1>
                  <h1 className="text-sm text-[#969696]">Name</h1>
                  <h1 className="text-sm text-[#969696]">Username</h1>
                  <h1 className="text-sm  text-[#969696]">Email</h1>
                </div>
                <div className="flex flex-col gap-y-6">
                  <Avatar
                    size={25}
                    name={session?.user.id}
                    variant="marble"
                    // colors={["#A4AB80", "#7C8569", "#52493A", "#E8E0AE", "#968F4B"]}
                    colors={[
                      "#E1EDD1",
                      "#AAB69B",
                      "#7C8569",
                      "#E8E0AE",
                      "#A4AB80",
                    ]}
                  />
                  <h1 className="text-sm text-[#969696]">
                    {session?.user.name}
                  </h1>
                  <div className="flex flex-row">
                    <h1 className="pr-0.5 text-sm  text-[#969696]">@</h1>
                    <h1 className="focus-ring:0 text-sm  text-[#969696] focus:outline-none">
                      {session?.user.username}
                    </h1>
                  </div>
                  <h1 className="focus-ring:0 text-sm  text-[#969696] focus:outline-none">
                    {session?.user.email}
                  </h1>
                </div>
              </div>
            </div>
            <Separator.Root
              decorative
              orientation="horizontal"
              className="my-6 h-[1px] w-full bg-[#E4E4E4]"
            />

            {data &&
              data.map((token: { id: string; name: string }) => (
                <div className="flex flex-row gap-x-20" key={token.id}>
                  <div className="flex flex-col gap-y-6">
                    <h1 className="text-sm text-[#969696]">{token.name}</h1>
                  </div>
                  <div className="flex flex-col gap-y-6">
                    <div className="flex flex-row gap-x-4">
                      <h1 className="text-sm text-[#969696]">{token.id}</h1>
                      <button
                        onClick={() => {
                          copyToClipboard(token.id);
                        }}
                      >
                        <IoCopyOutline className="text-[#969696]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <Image src={schemeGradient} />
        </div>
      </div>
    )
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

export default Settings;
