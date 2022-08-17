import { FC } from "react";
import { BiPencil } from "react-icons/bi";
import { MdLockOutline } from "react-icons/md";

type FieldPropTypes = {
  name: string;
  type: "STRING" | "INT" | "BOOLEAN" | "AUTH";
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
        <div className="bg-[#F2F2F2] rounded-lg mr-2 px-3.5 flex items-center justify-center">
          <h1 className="text-[#969696] text-xl">{"[ ]"}</h1>
        </div>
      )}
      {optional && (
        <div className="bg-[#F2F2F2] rounded-lg px-4 flex items-center justify-center">
          <h1 className="text-[#969696] text-xl">{"?"}</h1>
        </div>
      )}
      {(array || optional) && (
        <div className="bg-[#E4E4E4] w-[0.1rem] rounded-full mx-4"></div>
      )}
    </div>
  );
};

const Field: FC<FieldPropTypes> = ({ name, type, array, optional }) => {
  let formattedType = {
    STRING: "ABC",
    INT: "123",
    BOOLEAN: "T/F",
    AUTH: <MdLockOutline className="h-7 w-7" />,
  };

  return (
    <div className="flex flex-row items-center mt-4 border-[#E4E4E4] border-[1.5px] py-2 px-2 rounded-xl w-3/5 relative">
      <div className="bg-[#F2F2F2] py-2 px-4 rounded-lg mr-12">
        <p className="text-xl font-light tracking-wider text-[#747474] flex items-center justify-center">
          {formattedType[type]}
        </p>
      </div>
      <div>
        <p className="text-xl font-light">{name}</p>
      </div>
      <div className="flex flex-row object-right absolute right-0">
        <Tags array={array} optional={optional} />
        <div className="bg-[#F2F2F2] rounded-lg mr-2 p-2 flex items-center justify-center">
          <BiPencil className="h-7 w-7 text-[#969696]" />
        </div>
      </div>
    </div>
  );
};

export default Field;
