import { FC, useState, FormEvent, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RouteStatus, RoutePriority } from "@prisma/client";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/future/image";
import Avatar from "boring-avatars";
import Priority from "../../public/priority.svg";
import { Formik, Form, Field } from "formik";
import RouteUser from "./RouteUser";
import { HiOutlinePlusSm } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import { useClickAway } from "react-use";

type User = {
  id: string;
  name: string;
  username: string;
};

type PropTypes = {
  projectId: string;
  routeId: string;
  status: RouteStatus;
  priority: RoutePriority;
  owner: User;
  assignedTo: Array<User>;
};

const RouteMetaData: FC<PropTypes> = ({
  projectId,
  routeId,
  status,
  priority,
  owner,
  assignedTo,
}) => {
  const [addMembers, setAddMembers] = useState(false);
  const [username, setUsername] = useState("");

  const queryClient = useQueryClient();

  const updateRoute = useMutation(
    ({
      status,
      priority,
    }: {
      status?: "PROTOTYPING" | "DEVELOPING" | "COMPLETE";
      priority?: "LOW" | "MEDIUM" | "HIGH";
    }) => {
      return axios.post("http://localhost:3000/api/route/update.route", {
        routeId,
        status,
        priority,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  const assignMember = useMutation(
    ({ username }: { username: string }) => {
      return axios.post("http://localhost:3000/api/route/assignMember.route", {
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

  const getUser = async (username: string) => {
    const response = await axios.get(
      `/api/user/get.user?username=${username}&projectId=${projectId}`
    );

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

  const ref = useRef(null);
  useClickAway(ref, () => {
    setAddMembers(false);
  });

  return (
    <div className="flex flex-col gap-y-8 border-l-[1px] border-[#E4E4E4] pl-8 pt-8">
      <DropdownMenu.Root>
        <div>
          <h1 className="text-sm text-[#747474]">Status</h1>
          <DropdownMenu.Trigger>
            <div className="mt-2 flex flex-row items-center gap-x-4">
              <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
              <h1 className="text-sm text-black">{status}</h1>

              {/* <FiChevronDown className="ml-2 h-3.5 w-3.5 text-[#969696]" /> */}
            </div>
          </DropdownMenu.Trigger>
        </div>
        <DropdownMenu.Content className="mr-72 mt-[-2rem] w-40 rounded-md border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
          <DropdownMenu.Item
            className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              // router.push("/settings");
              updateRoute.mutate({
                status: "PROTOTYPING",
              });
            }}
          >
            <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
            <h1 className="text-sm text-[#969696]">Prototyping</h1>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              // router.push("/settings");
              updateRoute.mutate({
                status: "DEVELOPING",
              });
            }}
          >
            <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
            <h1 className="text-sm text-[#969696]">Development</h1>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              // router.push("/settings");
              updateRoute.mutate({
                status: "COMPLETE",
              });
            }}
          >
            <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" />
            <h1 className="text-sm text-[#969696]">Complete</h1>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DropdownMenu.Root>
        <div>
          <h1 className="text-sm text-[#747474]">Priority</h1>
          <DropdownMenu.Trigger>
            <div className="mt-2 flex flex-row items-center gap-x-4">
              {/* <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" /> */}
              <Image src={Priority} alt="priority" />
              <h1 className="text-sm text-black">{priority}</h1>
            </div>
          </DropdownMenu.Trigger>
        </div>
        <DropdownMenu.Content className="mr-64 mt-[-2rem] w-36 rounded-md border-[1px] border-[#E4E4E4] bg-white py-1.5 px-1.5 shadow-md">
          <DropdownMenu.Item
            className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              // router.push("/settings");
              updateRoute.mutate({
                priority: "LOW",
              });
            }}
          >
            <Image src={Priority} alt="priority" />
            <h1 className="text-sm text-[#969696]">Low</h1>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              // router.push("/settings");
              updateRoute.mutate({
                priority: "MEDIUM",
              });
            }}
          >
            <Image src={Priority} alt="priority" />
            <h1 className="text-sm text-[#969696]">Medium</h1>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center gap-x-4 rounded-md px-2 py-1.5 outline-none hover:bg-[#F2F2F2]"
            onClick={() => {
              // router.push("/settings");
              updateRoute.mutate({
                priority: "HIGH",
              });
            }}
          >
            <Image src={Priority} alt="priority" />
            <h1 className="text-sm text-[#969696]">High</h1>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {owner && (
        <div>
          <h1 className="text-sm text-[#747474]">Creator</h1>
          <div className="mt-3 flex flex-row items-start gap-x-4">
            {/* <div className="h-4 w-4 rounded-full border-[1.5px] border-[#969696]" /> */}
            {/* <Image src={Priority} alt="priority" /> */}
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
      )}
      <div>
        <h1 className="text-sm text-[#747474]">Assigned To</h1>
        {assignedTo.map(
          (user: { id: string; name: string; username: string }) => (
            <RouteUser id={user.id} name={user.name} username={user.username} />
          )
        )}
        {addMembers ? (
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

              assignMember.mutate(
                {
                  username: values.username.replace("@", ""),
                },
                {
                  onSuccess: () => {
                    setUsername("");
                    setAddMembers(false);
                  },
                }
              );
            }}
          >
            {({ values }) => (
              <Form
                onChange={(event: FormEvent) => {
                  setUsername(
                    (event.target as HTMLTextAreaElement).value.replace("@", "")
                  );
                }}
              >
                <div
                  className="mt-4 flex flex-row items-center gap-x-2"
                  ref={ref}
                >
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
                    {assignedTo.map(
                      (user: {
                        id: string;
                        name: string;
                        username: string;
                      }) => {
                        if (user.username === username) {
                          return (
                            <MdOutlineErrorOutline className="h-5 w-5 text-red-500" />
                          );
                        }
                      }
                    )}
                  </div>
                  {userData &&
                    !assignedTo.find(
                      (user: { id: string }) => user.id === userData.id
                    ) && (
                      <button
                        className="flex items-center justify-center"
                        type="submit"
                        onClick={() => {
                          values.submit = true;
                        }}
                      >
                        <BsArrowRightShort className="h-6 w-6 pt-1 text-[#747474] hover:text-black" />
                      </button>
                    )}
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <button
            className="mt-4 w-min"
            onClick={() => {
              setAddMembers(true);
            }}
          >
            <div className="flex flex-row items-center gap-x-1 text-[#969696] hover:text-black">
              <HiOutlinePlusSm className="h-3 w-3" />
              <h1 className="w-max text-sm">Assign Member</h1>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteMetaData;
