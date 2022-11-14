//React/Next;
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//Formik
import { Formik, Form, Field, useFormikContext } from "formik";
//Data Fetching
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
//Auth
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
//Images
import Image from "next/future/image";
import schemeGradient from "../../public/scheme-gradient.svg";
//Icons
import { MdOutlineErrorOutline } from "react-icons/md";

const FormObserver: React.FC<{ setUsername: any }> = ({ setUsername }) => {
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
    setUsername(values.username);
  }, [values]);

  return null;
};

const NewUser: NextPage = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");

  const router = useRouter();

  const onboardUser = useMutation(
    ({
      name,
      username,
      projectName,
    }: {
      name: string;
      username: string;
      projectName: string;
    }) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/user/onboard.user`,
        {
          userId: session!.user.id,
          name: name,
          username: username,
          projectName: projectName,
        }
      );
    }
  );

  const getUser = async (username: string) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/user/get.user?username=${username}`
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

  return (
    session && (
      <>
        <div className="flex h-screen flex-row items-center justify-center gap-x-48 pl-12">
          <div className="flex flex-col">
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
              <Formik
                initialValues={{
                  name: "",
                  username: "",
                  projectName: "",
                  submit: false,
                }}
                onSubmit={(values) => {
                  if (!values.submit) {
                    return;
                  }
                  values.submit = false;

                  onboardUser.mutate(
                    {
                      name: values.name,
                      username: values.username,
                      projectName: values.projectName,
                    },
                    {
                      onSuccess: () => {
                        router.push("/");
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
                        <h1 className="text-sm text-[#969696]">Name</h1>
                        <h1 className="text-sm text-[#969696]">Username</h1>
                        <h1 className="text-sm  text-[#969696]">
                          Project Name
                        </h1>
                      </div>
                      <div className="flex flex-col gap-y-6">
                        <Field
                          name="name"
                          autoComplete="off"
                          placeholder="Firstname Lastname"
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
                            placeholder="username"
                            className={`focus-ring:0 text-sm  text-[#969696] focus:outline-none ${
                              values.username !== "" && "text-black"
                            }`}
                          />
                          {/* <WarningCircledOutline className="h-[1.2rem] w-[1.2rem] text-red-500" /> */}
                          {userData && (
                            <MdOutlineErrorOutline className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <Field
                          name="projectName"
                          autoComplete="off"
                          placeholder="project name"
                          className={`focus-ring:0 text-sm  text-[#969696] focus:outline-none ${
                            values.projectName !== "" && "text-black"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      {!userData && (
                        <button
                          className="rounded-md border-[1px] border-[#E4E4E4] px-2 py-1 text-sm font-light text-black hover:shadow-sm"
                          type="submit"
                          onClick={() => {
                            values.submit = true;
                          }}
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div>
            <Image src={schemeGradient} alt="scheme gradient" />
          </div>
        </div>
      </>
    )
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

  if (session.user.onboarded === true) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
}

export default NewUser;
