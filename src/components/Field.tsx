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

const Field: FC<FieldPropTypes> = ({ name, type, array, optional }) => {
  let formattedType = {
    STRING: "ABC",
    INT: "123",
    BOOLEAN: "T/F",
    AUTH: <MdLockOutline className="h-7 w-7" />,
  };

  return (
    <div className="relative mt-4 flex w-3/5 flex-row items-center rounded-xl border-[1.5px] border-[#E4E4E4] py-2 px-1.5">
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
        <div className="mr-2 flex items-center justify-center rounded-md bg-[#F2F2F2] p-1.5">
          <BiPencil className="h-7 w-7 text-[#969696]" />
        </div>
      </div>
    </div>
  );
};

export default Field;
