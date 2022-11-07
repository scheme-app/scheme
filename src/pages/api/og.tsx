import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const PostTag = () => {
  return (
    <div tw="mt-4 flex items-center rounded-xl h-12 bg-[#FBF3EE] px-3">
      <h1 tw="text-4xl font-semibold text-[#D6B29D]">POST</h1>
    </div>
  );
};

const GetTag = () => {
  return (
    <div tw="mt-4 flex items-center rounded-xl h-12 bg-[#EBF7F7] px-4">
      <h1 tw="text-4xl font-semibold text-[#86B0B1]">GET</h1>
    </div>
  );
};

const handler = async (req: NextRequest) => {
  let name = "veryLongUpdatedsfsdfsdf.user";
  name.length > 21 ? (name = name.substring(0, 18) + "...") : (name = name);

  const { searchParams } = new URL(req.url);

  const routeId = searchParams.get("routeId");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/route/getPreview.route?routeId=${routeId}`
  );

  const data = await response.json();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        {/* <div tw="flex relative h-full w-full justify-center">
          <div tw="flex flex-row items-center absolute top-[45%]">
            <h1 tw="text-7xl pr-6">{data.name}</h1>
            {data.type === "GET" ? <GetTag /> : <PostTag />}
          </div>
          <div tw="flex flex-row items-center absolute bottom-0 left-0 mb-6 ml-4">
            <img
              width="60"
              height="60"
              src={`${process.env.NEXT_PUBLIC_VERCEL_URL}/scheme-icon-black.svg`}
            />
            <h1 tw="text-3xl pl-4">View on Scheme</h1>
          </div>
        </div> */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};

export default handler;
