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
    <div className="flex flex-row">
      {array && (
        <div className="mr-2 flex items-center justify-center rounded-md bg-[#F2F2F2] px-3">
          <h1 className="text-xl text-[#969696]">{"[ ]"}</h1>
        </div>
      )}
      {optional && (
        <div className="flex items-center justify-center rounded-md bg-[#F2F2F2] px-4">
          <h1 className="text-xl text-[#969696]">{"?"}</h1>
        </div>
      )}
      {(array || optional) && (
        <div className="mx-4 w-[0.1rem] rounded-full bg-[#E4E4E4]"></div>
      )}
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
      <div className="relative mt-4 flex flex-row items-center rounded-xl border-[1.5px] border-[#E4E4E4] p-1.5">
        <div className="mr-12 rounded-md bg-[#F2F2F2] py-2 px-4">
          <p className="flex items-center justify-center text-lg font-light tracking-wider text-[#747474]">
            {formattedType[type]}
          </p>
        </div>
        <div className="w-2/5">
          <p className="truncate text-xl font-light">{name}</p>
        </div>
        <div className="absolute right-0 flex flex-row">
          <Tags array={array} optional={optional} />
          <button
            className="mr-2 flex items-center justify-center rounded-md bg-[#F2F2F2] p-1.5"
            onClick={() => {
              setShowEditFieldPopover(!showEditFieldPopover);
            }}
          >
            <BiPencil className="h-7 w-7 text-[#969696]" />
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
