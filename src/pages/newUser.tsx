import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/future/image";
import schemeGradient from "../../public/scheme-gradient.svg";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

const NewUser: NextPage = () => {
  const { data: session } = useSession();

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
      return axios.post("http://localhost:3000/api/user/onboard.user", {
        userId: session!.user.id,
        name: name,
        username: username,
        projectName: projectName,
      });
    }
  );

  // useEffect(() => {
  //   if (session === null) {
  //     router.push("/login");
  //   }

  //   if (session?.user.onboarded === true) {
  //     router.push("/");
  //   }
  // });

  return (
    session && (
      <>
        <h1>{JSON.stringify(session)}</h1>
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
                        // while (router.isReady === false) {}
                        // if (router.isReady === true) {
                        //   // router.push("/", undefined, { shallow: false });
                        //   router.push("/");
                        // }

                        router.push("/");
                      },
                    }
                  );
                }}
              >
                {({ values }) => (
                  <Form className="flex flex-col gap-y-6">
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
                      <button
                        className="rounded-md border-[1px] border-[#E4E4E4] px-2 py-1 text-sm font-light text-black hover:shadow-sm"
                        type="submit"
                        onClick={() => {
                          values.submit = true;
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div>
            <Image src={schemeGradient} />
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
      // session: await unstable_getServerSession(
      //   context.req,
      //   context.res,
      //   authOptions
      // ),
      session: session,
    },
  };
}

export default NewUser;