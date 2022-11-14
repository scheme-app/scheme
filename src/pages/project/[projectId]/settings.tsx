import type { NextPage } from "next";
import { FC, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/future/image";
import schemeGradient from "../../../../public/scheme-gradient.svg";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { HiOutlinePlusSm } from "react-icons/hi";
import * as Separator from "@radix-ui/react-separator";
import Avatar from "boring-avatars";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import { BsArrowRightShort } from "react-icons/bs";
import { MdOutlineErrorOutline } from "react-icons/md";
import * as ScrollArea from "@radix-ui/react-scroll-area";

const Settings: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [tab, setTab] = useState<"GENERAL" | "MEMBERS">("MEMBERS");

  const [addMembers, setAddMembers] = useState(false);
  const [addMemberType, setAddMemberType] = useState<"MEMBER" | "ADMIN">(
    "MEMBER"
  );
  const [username, setUsername] = useState("");

  const getMembers = async () => {
    const response = await axios.get(
      `/api/project/getMembers.project?projectId=${projectId}`
    );

    return response.data;
  };

  const { data: membersData, status: membersStatus } = useQuery(
    ["members"],
    getMembers
  );

  const getUser = async (username: string) => {
    const response = await axios.get(`/api/user/get.user?username=${username}`);

    return response.data;
  };

  const { data: userData, status: userStatus } = useQuery(
    ["user", username],
    () => getUser(username),
    {
      enabled: !!username,
      retry: true,
    }
  );

  const { data: projectData, status } = useQuery([projectId], async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/project/get.project?projectId=${projectId}`
    );

    return response.data;
  });

  const queryClient = useQueryClient();

  const addMember = useMutation(
    (data: {
      username: string;
      type: "MEMBER" | "ADMIN";
      projectId: string;
    }) => {
      return axios.post(`/api/project/addMember.project`, {
        username: data.username,
        type: data.type,
        projectId: data.projectId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["members"]);
      },
    }
  );

  const removeMember = useMutation(
    (data: { username: string; projectId: string }) => {
      return axios.post(`/api/project/removeMember.project`, {
        username: data.username,
        projectId: data.projectId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["members"]);
      },
    }
  );

  const Member: FC<{
    id: string;
    name: string;
    username: string;
    role: "MEMBER" | "ADMIN" | "OWNER";
  }> = ({ id, name, username, role }) => {
    const formattedRole = {
      MEMBER: "Member",
      ADMIN: "Admin",
      OWNER: "Owner",
    };
    return (
      <>
        <div className="relative mx-1 my-4 flex flex-row items-center">
          <div className="flex flex-row items-center">
            <div className="pr-8">
              <Avatar
                size={25}
                name={id}
                variant="marble"
                colors={["#E1EDD1", "#AAB69B", "#7C8569", "#E8E0AE", "#A4AB80"]}
              />
            </div>
            <h1 className="w-52 truncate">{name}</h1>
            <div className="w-32">
              <h1 className="text-sm italic text-[#969696]">@{username}</h1>
            </div>
            {/* <div className="flex items-center justify-center gap-x-2 rounded-md bg-[#F2F2F2] px-2 py-0.5"> */}
            <div className="py-0.25 flex items-center justify-center gap-x-2 rounded-full border-[1px] border-[#E4E4E4] px-2">
              <div className="h-1.5 w-1.5  rounded-full bg-[#969696]" />
              <h1 className="text-sm font-light text-[#969696]">
                {formattedRole[role]}
              </h1>
            </div>
          </div>
          <button
            className="absolute right-0 mr-1"
            onClick={() => {
              removeMember.mutate({
                username: username,
                projectId: projectId as string,
              });
            }}
          >
            <h1 className="text-sm text-[#747474] hover:text-black">remove</h1>
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-screen flex-row items-center justify-center gap-x-24">
      <div>
        <div className="mb-2 flex w-[36rem] flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-x-4">
            <button
              className={`text-sm ${
                tab === "GENERAL"
                  ? "text-black underline underline-offset-2"
                  : "text-[#747474]"
              }`}
              onClick={() => {
                setTab("GENERAL");
              }}
            >
              General
            </button>
            <button
              className={`text-sm ${
                tab === "MEMBERS"
                  ? "text-black underline underline-offset-2"
                  : "text-[#747474]"
              }`}
              onClick={() => {
                setTab("MEMBERS");
              }}
            >
              Members
            </button>
          </div>
          {tab === "MEMBERS" && addMembers ? (
            <Formik
              initialValues={{
                submit: false,
                username: "",
              }}
              onSubmit={async (values) => {
                if (!values.submit) {
                  return;
                }
                values.submit = false;

                addMember.mutate(
                  {
                    username: values.username.replace("@", ""),
                    type: addMemberType || "MEMBER",
                    projectId: projectId as string,
                  },
                  {
                    onSuccess: () => {
                      console.log("success");
                      setUsername("");
                      values.username = "";
                    },
                  }
                );
              }}
            >
              {({ values }) => (
                <Form
                  onChange={(event: FormEvent) => {
                    setUsername(
                      (event.target as HTMLTextAreaElement).value.replace(
                        "@",
                        ""
                      )
                    );
                  }}
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="flex h-[2.25rem] flex-row items-center gap-x-2 rounded-lg border-[1px] border-[#E4E4E4] px-2">
                      {userData && (
                        <Avatar
                          size={25}
                          name={userData.id}
                          variant="marble"
                          colors={[
                            "#E1EDD1",
                            "#AAB69B",
                            "#7C8569",
                            "#E8E0AE",
                            "#A4AB80",
                          ]}
                        />
                      )}
                      <Field
                        name="username"
                        autoComplete="off"
                        placeholder="@username"
                        className="w-28 text-sm font-light focus:outline-none"
                      />
                      {membersData &&
                        (membersData[0].users.find(
                          (user: any) => user.username === username
                        ) ||
                          membersData[1].users.find(
                            (user: any) => user.username === username
                          ) ||
                          membersData[2].users.find(
                            (user: any) => user.username === username
                          )) && (
                          <MdOutlineErrorOutline className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                    {userData &&
                      membersData &&
                      !(
                        membersData[0].users.find(
                          (user: any) => user.username === username
                        ) ||
                        membersData[1].users.find(
                          (user: any) => user.username === username
                        ) ||
                        membersData[2].users.find(
                          (user: any) => user.username === username
                        )
                      ) && (
                        <>
                          <div className="flex h-[2.25rem] flex-row items-center rounded-md border-[1px] border-[#E4E4E4] px-1">
                            <button
                              type="button"
                              className={`rounded-[0.25rem] ${
                                addMemberType === "MEMBER"
                                  ? "bg-[#F2F2F2] text-black"
                                  : "text-[#747474] hover:text-black"
                              } px-2 py-1.5`}
                              onClick={() => {
                                setAddMemberType("MEMBER");
                              }}
                            >
                              <h1 className="text-xs">Member</h1>
                            </button>
                            <button
                              type="button"
                              className={`rounded-[0.25rem] ${
                                addMemberType === "ADMIN"
                                  ? "bg-[#F2F2F2] text-black"
                                  : "text-[#747474] hover:text-black"
                              } px-2 py-1.5`}
                              onClick={() => {
                                setAddMemberType("ADMIN");
                              }}
                            >
                              <h1 className="text-xs">Admin</h1>
                            </button>
                          </div>
                          <button
                            className="flex items-center justify-center"
                            type="submit"
                            onClick={() => {
                              values.submit = true;
                            }}
                          >
                            <BsArrowRightShort className="h-6 w-6 pt-1 text-[#747474] hover:text-black" />
                          </button>
                        </>
                      )}
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            tab === "MEMBERS" && (
              <button
                className="flex flex-row items-center gap-x-0.5 text-[#747474] underline-offset-2 hover:text-black hover:underline"
                onClick={() => {
                  setAddMembers(true);
                }}
              >
                <HiOutlinePlusSm className="mb-0.5 h-3.5 w-3.5" />
                <h1 className="text-sm">Add Member</h1>
              </button>
            )
          )}
        </div>
        <Separator.Root
          decorative
          orientation="horizontal"
          className="h-[1px] bg-[#E4E4E4]"
        />
        {tab === "MEMBERS" ? (
          <ScrollArea.Root>
            <ScrollArea.Viewport className="h-[20rem] w-full">
              {membersData?.map((role: any, roleKey: number) => {
                return role.users.map((user: any, key: number) => {
                  return (
                    <>
                      {key + roleKey !== 0 && (
                        <Separator.Root
                          decorative
                          orientation="horizontal"
                          className="h-[1px] bg-[#E4E4E4]"
                        />
                      )}
                      <Member
                        key={key}
                        id={user.id}
                        name={user.name}
                        username={user.username}
                        role={role.type}
                      />
                    </>
                  );
                });
              })}
              <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
              <ScrollArea.Corner />
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        ) : (
          projectData && (
            <div className="flex h-[20rem] flex-row items-center justify-center">
              <h1>Coming Soon...</h1>
            </div>
          )
        )}
      </div>
      <div>
        <Image src={schemeGradient} alt="scheme gradient" />
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
