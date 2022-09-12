import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

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

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }

    if (session?.user.onboarded === true) {
      router.push("/");
    }
  });

  return (
    <>
      <h1>{JSON.stringify(session)}</h1>
      <div className="flex h-screen items-center pl-[24rem]">
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <h1 className="text-3xl font-light italic">
                Pragmatic API design
              </h1>
              <h1 className="text-3xl font-light">for developers & teams</h1>
            </div>
            <h1 className="w-[26rem] text-sm text-[#969696]">
              A barebones service to map out and document your service's API
              enpoints for internal and external use.
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

                console.log("submitting...");

                onboardUser.mutate({
                  name: values.name,
                  username: values.username,
                  projectName: values.projectName,
                });

                console.log("submitted");

                // router.push("/");
              }}
            >
              {({ values }) => (
                <Form className="flex flex-col gap-y-6">
                  <div className="flex flex-row gap-x-16">
                    <div className="flex flex-col gap-y-6">
                      <h1 className="text-sm text-[#969696]">Name</h1>
                      <h1 className="text-sm text-[#969696]">Username</h1>
                      <h1 className="text-sm  text-[#969696]">Project Name</h1>
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
      </div>
    </>
  );
};

export default NewUser;
