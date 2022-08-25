import { FC, useState, useRef, useEffect } from "react";
import { BsFolder, BsFolder2Open } from "react-icons/bs";
import Route from "./Route";
import autoAnimate from "@formkit/auto-animate";

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

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div className={`${isOpen ? "mb-2" : ""}`}>
      <button
        className="mb-2 flex flex-row"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <BsFolder2Open className="mr-6 h-6 w-6 text-[#969696]" />
        ) : (
          <BsFolder className="mr-6 h-6 w-6 text-[#969696]" />
        )}
        <h1 className="text-md">{name}</h1>
      </button>
      <div className="ml-4" ref={parent}>
        {isOpen &&
          routes.map((route) => (
            <Route
              key={route.id}
              id={route.id}
              name={route.name}
              type={route.type}
            />
          ))}
      </div>
    </div>
  );
};

export default Folder;
