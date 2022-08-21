import type { NextPage } from "next";
import Folder from "../components/Folder";
import SampleRoutes from "../components/SampleRoutes";

const Testing: NextPage = () => {
  return (
    // <div className="flex h-screen items-center justify-center">
    <Folder name="Testing" routes={SampleRoutes} />
    // </div>
  );
};

export default Testing;
