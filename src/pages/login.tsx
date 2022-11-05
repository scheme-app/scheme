//react
import type { NextPage } from "next";
//images
import Image from "next/future/image";
import schemeGradient from "../../public/scheme-gradient.svg";
//icons
import { FaGoogle } from "react-icons/fa";
//auth
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

type PropTypes = {
  providers: any;
};

const Login: NextPage<PropTypes> = ({ providers }) => {
  const provider = Object.values(providers)[0];

  return (
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
          <div className="mt-8">
            <button
              className="mt-6 flex flex-row items-center justify-center gap-x-4 rounded-md bg-black px-2.5 py-2"
              onClick={() => {
                signIn((provider as any).id);
              }}
            >
              <FaGoogle className="h-5 w-5 text-white" />
              <h1 className="text-xs text-white">Continue with Google</h1>
            </button>
            <h1 className=" mt-6 w-60 text-[0.6rem] text-[#969696]">
              By continuing, you agree to our Terms of Use and Privacy Policy
            </h1>
          </div>
        </div>
        <div>
          <Image src={schemeGradient} alt="scheme gradient" />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const providers = await getProviders();

  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session?.user.onboarded === false) {
    return {
      redirect: {
        destination: "/newUser",
      },
    };
  }
  if (session?.user.onboarded === true) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      providers,
      session: session,
    },
  };
}

export default Login;
