import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FaGoogle } from "react-icons/fa";
import { getProviders, signIn } from "next-auth/react";

const Login: NextPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    // if (session !== null) {
    //   router.push("/api/auth/signout");
    // }
    // if (session?.user.onboarded === true) {
    //   router.push("/");
    // }
  });

  return (
    <>
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
              A barebones service to map out and document your service&apos;s
              API enpoints for internal and external use.
            </h1>
          </div>
          <div className="mt-8">
            <button className="mt-6 flex flex-row items-center justify-center gap-x-4 rounded-md bg-black px-2.5 py-2">
              <FaGoogle className="h-5 w-5 text-white" />
              <h1 className="text-xs text-white">Continue with Google</h1>
            </button>
            <h1 className=" mt-6 w-60 text-[0.6rem] text-[#969696]">
              By continuing, you agree to our Terms of Use and Privacy Policy
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
