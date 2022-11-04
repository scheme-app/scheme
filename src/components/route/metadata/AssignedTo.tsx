import { FC, useState, useRef, FormEvent, useContext } from "react";

import RouteContext from "@/context/Route.context";
import ProjectContext from "@/context/Project.context";

import { User } from "./User";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Formik, Form, Field } from "formik";

import { HiOutlinePlusSm } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";

import { useClickAway } from "react-use";

import Avatar from "boring-avatars";

type User = {
  id: string;
  name: string;
  username: string;
};

type PropTypes = {
  assignedTo: Array<User>;
};

const AssignedTo: FC<PropTypes> = ({ assignedTo }) => {
  const [addMembers, setAddMembers] = useState(false);
  const [username, setUsername] = useState("");

  const { routeId } = useContext(RouteContext);
  const { project } = useContext(ProjectContext);

  const queryClient = useQueryClient();

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
      `/api/user/get.user?username=${username}&projectId=${project.id}`
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
    <div>
      <h1 className="text-sm text-[#747474]">Assigned To</h1>
      {assignedTo.map(
        (user: { id: string; name: string; username: string }) => (
          <User id={user.id} name={user.name} username={user.username} />
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
                    (user: { id: string; name: string; username: string }) => {
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
  );
};

export { AssignedTo };
