import { FC, useState, useRef, useEffect } from "react";
import { BiPencil } from "react-icons/bi";
import EditFieldPopover from "./EditFieldPopover";
import autoAnimate from "@formkit/auto-animate";

type FieldPropTypes = {
  id: string;
  name: string;
  type: "STRING" | "INT" | "BOOLEAN";
  array: boolean;
  optional: boolean;
};

type TagsPropTypes = {
  array: boolean;
  optional: boolean;
};

const Tags: FC<TagsPropTypes> = ({ array, optional }) => {
  return (
    <div className="mr-8 flex flex-row gap-x-3">
      {array && (
        <div className="flex items-center justify-center rounded-md bg-[#F2F2F2] px-2.5 py-1">
          <h1 className="text-md mb-0.5 text-[#969696]">{"[ ]"}</h1>
        </div>
      )}
      {optional && (
        <div className="flex items-center justify-center rounded-md bg-[#F2F2F2] px-3.5 py-1">
          <h1 className="text-md text-[#969696]">{"?"}</h1>
        </div>
      )}
      {/* {(array || optional) && (
        <div className="mx-4 w-[0.1rem] rounded-full bg-[#E4E4E4]"></div>
      )} */}
    </div>
  );
};

const Field: FC<FieldPropTypes> = ({ id, name, type, array, optional }) => {
  const [showEditFieldPopover, setShowEditFieldPopover] = useState(false);

  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 200,
        easing: "ease-in-out",
      });
  }, [parent]);

  const formattedType = {
    STRING: "ABC",
    INT: "123",
    BOOLEAN: "T/F",
  };

  return (
    <div ref={parent}>
      <div className="relative mx-1 my-2 flex flex-row items-center">
        <div className="mr-12 rounded-md bg-[#F2F2F2] py-1.5 px-4">
          <p className="text-md flex items-center justify-center font-light tracking-wider text-[#747474]">
            {formattedType[type]}
          </p>
        </div>
        <div className="w-2/5">
          <p className="truncate text-lg font-light">{name}</p>
        </div>
        <div className="absolute right-0 mr-1 flex flex-row">
          <Tags array={array} optional={optional} />
          {/* <button
            className="mr-2 flex items-center justify-center rounded-md bg-[#F2F2F2] p-1.5"
            onClick={() => {
              setShowEditFieldPopover(!showEditFieldPopover);
            }}
          >
            <BiPencil className="h-7 w-7 text-[#969696]" />
          </button> */}
          <button
            onClick={() => {
              setShowEditFieldPopover(!showEditFieldPopover);
            }}
          >
            <h1 className="text-md font-light text-[#969696]">edit</h1>
          </button>
        </div>
      </div>
      {showEditFieldPopover && (
        <EditFieldPopover
          fieldId={id}
          name={name}
          type={type}
          array={array}
          optional={optional}
          setEditFieldPopover={setShowEditFieldPopover}
        />
      )}
    </div>
  );
};

export default Field;
