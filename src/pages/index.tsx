import type { NextPage } from "next";
import Field from "../components/Field";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="border-r-[1.5px] border-[#E4E4E4] w-1/4 flex-col items-center justify-center">
          <h1>Side Bar</h1>
        </div>
        <div className="flex-col justify-center w-full p-8 px-24 h-screen">
          <div className="flex flex-row gap-x-2">
            <h1 className="text-[#969696] text-sm italic tracking-wider">
              Index / user /
            </h1>
            <h1 className="text-black text-sm underline">createUser</h1>
          </div>
          <div className="ml-20">
            <div className="flex flex-row gap-x-4 items-center mt-16">
              <h1 className="text-4xl">createUser</h1>
              <div className="bg-[#FBF3EE] flex items-center px-2 h-6 mt-2 rounded-md">
                <h1 className="text-[#D6B29D] font-semibold text-md">POST</h1>
              </div>
            </div>
            <div className="flex flex-col mt-8">
              <h1 className="text-xl">Authorization</h1>
              <Field type="AUTH" name="Bearer" array={false} optional={false} />
            </div>
            <div className="flex flex-col mt-8">
              <h1 className="text-xl">Arguments</h1>
              <Field
                type="STRING"
                name="username"
                array={false}
                optional={true}
              />
              <Field type="STRING" name="email" array={true} optional={true} />
              <Field
                type="BOOLEAN"
                name="approved"
                array={false}
                optional={false}
              />
            </div>
            <div className="flex flex-col mt-8">
              <h1 className="text-xl">Response</h1>
              <Field
                type="STRING"
                name="username"
                array={false}
                optional={false}
              />
              <Field
                type="STRING"
                name="email"
                array={false}
                optional={false}
              />
              <Field
                type="BOOLEAN"
                name="approved"
                array={false}
                optional={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
