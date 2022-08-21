import { FC, useState } from "react";
import { HiOutlineFolder, HiOutlineFolderOpen } from "react-icons/hi";
import Route from "./Route";

type PropTypes = {
  name: string;
  routes: Array<{
    id: string;
    name: string;
    type: "GET" | "POST";
  }>;
};

const Folder: FC<PropTypes> = ({ name, routes }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="mb-2 flex flex-row"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <HiOutlineFolderOpen className="mr-6 h-6 w-6 text-[#969696]" />
        ) : (
          <HiOutlineFolder className="mr-6 h-6 w-6 text-[#969696]" />
        )}
        <h1 className="text-md">{name}</h1>
      </button>
      <div className="ml-4">
        {isOpen && (
          <div>
            {routes.map((route) => (
              <Route
                key={route.id}
                id={route.id}
                name={route.name}
                type={route.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Folder;
