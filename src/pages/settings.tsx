//React/Next
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Router from "next/router";
//Auth
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
//Images
import Image from "next/future/image";
import schemeGradient from "../../public/scheme-gradient.svg";
import Avatar from "boring-avatars";
//Formik
import { Formik, Form, Field, useFormikContext } from "formik";
//Data Fetching
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
//Icons
import { MdOutlineErrorOutline } from "react-icons/md";
//Components
import { Button } from "@components/shared";
import * as Separator from "@radix-ui/react-separator";

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

const FormObserver: React.FC<{ setUsername: (username: string) => void }> = ({
  setUsername,
}) => {
  const {
    values,
  }: {
    values: {
      name: string;
      username: string;
      projectName: string;
      submit: boolean;
    };
  } = useFormikContext();

  useEffect(() => {
    // alert(`FormObserver::values -- ${JSON.stringify(values)}`);
    setUsername(values.username);
  }, [values]);

  return null;
};

const Settings: NextPage = () => {
  const { data: session } = useSession();
  const [editProfile, setEditProfile] = useState(false);
  const [username, setUsername] = useState("");

  const updateProfile = useMutation(
    ({ name, username }: { name?: string; username?: string }) => {
      return axios.post("/api/user/update.user", {
        userId: session?.user.id,
        name,
        username,
      });
    }
  );

  const { data: userData, status: userStatus } = useQuery(
    ["user", username],
    async () => {
      const response = await axios.get(
        `/api/user/get.user?username=${username}`
      );

      return response.data;
    },
    {
      enabled: !!username,
      retry: true,
    }
  );

  return (
    session &&
    (editProfile ? (
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
            <Separator.Root
              decorative
              orientation="horizontal"
              className="mt-6 h-[1px] w-full bg-[#E4E4E4]"
            />
            <div className="mt-12">
              <Formik
                initialValues={{
                  name: "",
                  username: "",
                  submit: false,
                }}
                onSubmit={(values) => {
                  if (!values.submit) {
                    return;
                  }
                  values.submit = false;

                  updateProfile.mutate(
                    {
                      name: values.name || session?.user.name,
                      username: values.username || session?.user.username!,
                    },
                    {
                      onSuccess: () => {
                        Router.reload();
                      },
                    }
                  );
                }}
              >
                {({ values }) => (
                  <Form className="flex flex-col gap-y-6">
                    <FormObserver setUsername={setUsername} />
                    <div className="flex flex-row gap-x-16">
                      <div className="flex flex-col gap-y-6">
                        <h1 className="text-sm text-[#969696]">Avatar</h1>
                        <h1 className="text-sm text-[#969696]">Name</h1>
                        <h1 className="text-sm text-[#969696]">Username</h1>
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
                        <Field
                          name="name"
                          autoComplete="off"
                          placeholder={session?.user.name}
                          className={`focus-ring:0 text-sm text-[#969696] focus:outline-none ${
                            values.name !== "" && "text-black"
                          }`}
                        />
                        <div className="flex flex-row">
                          <h1
                            className={`pr-0.5 text-sm  text-[#969696] ${
                              values.username !== "" && "text-black"
                            }`}
                          >
                            @
                          </h1>
                          <Field
                            name="username"
                            autoComplete="off"
                            placeholder={session?.user.username}
                            className={`focus-ring:0 text-sm  text-[#969696] focus:outline-none ${
                              values.username !== "" && "text-black"
                            }`}
                          />
                          {userData && (
                            <MdOutlineErrorOutline className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-row gap-x-3">
                      {!userData && (
                        <Button
                          name="Save"
                          type="submit"
                          style="primary"
                          onClick={() => {
                            values.submit = true;
                          }}
                        />
                      )}
                      <Button
                        name="Cancel"
                        type="button"
                        style="secondary"
                        onClick={() => {
                          setUsername("");
                          setEditProfile(false);
                        }}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div>
          <Image src={schemeGradient} alt="scheme gradient" />
        </div>
      </div>
    ) : (
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
            <Separator.Root
              decorative
              orientation="horizontal"
              className="mt-6 h-[1px] w-full bg-[#E4E4E4]"
            />
            <div className="mt-12">
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
                  <h1 className="text-sm text-black">{session?.user.name}</h1>
                  <div className="flex flex-row">
                    <h1 className="pr-0.5 text-sm  text-black">@</h1>
                    <h1 className="focus-ring:0 text-sm  text-black focus:outline-none">
                      {session?.user.username}
                    </h1>
                  </div>
                  <h1 className="focus-ring:0 text-sm  text-black focus:outline-none">
                    {session?.user.email}
                  </h1>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-row gap-x-2">
              <Button
                name="Edit Profile"
                type="button"
                style="primary"
                size="small"
                onClick={() => {
                  setEditProfile(true);
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <Image src={schemeGradient} alt="scheme gradient" />
        </div>
      </div>
    ))
  );
};

export default Settings;
