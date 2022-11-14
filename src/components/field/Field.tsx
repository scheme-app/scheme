//react
import { FC, useState, useRef, useEffect } from "react";
//components
import EditFieldPopover from "./Field.EditPopover";
//types
import type { FieldType, FieldFormat } from "@prisma/client";
//misc
import autoAnimate from "@formkit/auto-animate";

type FieldPropTypes = {
  id: string;
  name: string;
  type: FieldType;
  array: boolean;
  optional: boolean;
  format: FieldFormat;
};

type TagsPropTypes = {
  array: boolean;
  optional: boolean;
  format: FieldFormat;
};

const formattedFormat = {
  NONE: "None",
  INT32: "int32",
  INT64: "int64",
  FLOAT: "Float",
  DOUBLE: "Double",
  BYTE: "Byte",
  BINARY: "Binary",
  DATE: "Date",
  DATE_TIME: "Date Time",
  PASSWORD: "Password",
};

const Tags: FC<TagsPropTypes> = ({ array, optional, format }) => {
  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 200,
        easing: "ease-in-out",
      });
  }, [parent]);

  return (
    <div className="mr-8 flex flex-row gap-x-3" ref={parent}>
      {format && format !== "NONE" && (
        <div className="flex items-center justify-center gap-x-2 rounded-md bg-[#F2F2F2] px-2 py-0.5">
          <div className="h-1.5 w-1.5  rounded-full bg-[#969696]" />
          <h1 className="text-sm font-light text-[#969696]">
            {formattedFormat[format]}
          </h1>
        </div>
      )}
      {array && (
        <div className="flex items-center justify-center gap-x-2 rounded-md bg-[#F2F2F2] px-2 py-0.5">
          <div className="h-1.5 w-1.5  rounded-full bg-[#969696]" />
          <h1 className="text-sm font-light text-[#969696]">array</h1>
        </div>
      )}
      {optional && (
        <div className="flex items-center justify-center gap-x-2 rounded-md bg-[#F2F2F2] px-2 py-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#969696]" />
          <h1 className="text-sm font-light text-[#969696]">optional</h1>
        </div>
      )}
    </div>
  );
};

const Field: FC<FieldPropTypes> = ({
  id,
  name,
  type,
  array,
  optional,
  format,
}) => {
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
    COMPLEX: "{ }",
  };

  return (
    <div ref={parent}>
      <div className="relative mx-1 my-2.5 flex flex-row items-center">
        <div className="mr-12 rounded-md bg-[#F2F2F2] py-1 px-2.5">
          <p className="text-md flex items-center justify-center font-light tracking-wider text-[#747474]">
            {formattedType[type]}
          </p>
        </div>
        <div
          className={`${
            array || optional || format !== "NONE" ? "w-[39%]" : "w-[70%]"
          }`}
        >
          <p className="truncate text-lg font-light">{name}</p>
        </div>
        <div className="absolute right-0 mr-1 flex flex-row">
          <Tags array={array} optional={optional} format={format} />
          <button
            onClick={() => {
              setShowEditFieldPopover(!showEditFieldPopover);
            }}
          >
            <h1 className="text-sm font-light text-[#969696]">edit</h1>
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
          format={format}
          setEditFieldPopover={setShowEditFieldPopover}
        />
      )}
    </div>
  );
};

export { Field };
export type { FieldPropTypes };
