//react
import { FC, useState, useRef, useEffect } from "react";
//components
import { Field, CreateFieldPopover } from "@components/field";
import * as Separator from "@radix-ui/react-separator";
//icons
import { HiOutlinePlusSm } from "react-icons/hi";
//types
import type { FieldPropTypes } from "@components/field";
//misc
import autoAnimate from "@formkit/auto-animate";

type ModelPropTypes = {
  id: string;
  name: string;
  fields: Array<FieldPropTypes>;
};

const Model: FC<ModelPropTypes> = ({ id, name, fields }) => {
  const [showCreateFieldPopover, setShowCreateFieldPopover] = useState(false);

  const parent = useRef(null);
  useEffect(() => {
    parent.current &&
      autoAnimate(parent.current, {
        duration: 250,
        easing: "ease-in-out",
      });
  }, [parent]);

  return (
    <div className="mt-8 flex flex-col" ref={parent}>
      <h1 className="text-md mb-2 font-light text-[#747474]">{name}</h1>
      {fields.length === 0 && (
        <Separator.Root
          decorative
          orientation="horizontal"
          className="h-[1px] bg-[#E4E4E4]"
        />
      )}
      {fields.map(({ id, name, type, array, optional, format }) => {
        return (
          <>
            <Separator.Root
              decorative
              orientation="horizontal"
              className="h-[1px] bg-[#E4E4E4]"
            />
            <Field
              key={id}
              id={id}
              name={name}
              type={type}
              array={array}
              optional={optional}
              format={format}
            />
          </>
        );
      })}

      {!showCreateFieldPopover && (
        <button
          className="mt-4 w-min"
          onClick={() => {
            setShowCreateFieldPopover(!showCreateFieldPopover);
          }}
        >
          <div className="flex flex-row items-center gap-x-1 text-[#969696]">
            <HiOutlinePlusSm className="h-3 w-3" />
            <h1 className="w-max text-sm">Add Field</h1>
          </div>
        </button>
      )}

      {showCreateFieldPopover && (
        <CreateFieldPopover
          parentModelId={id}
          setCreateFieldPopover={setShowCreateFieldPopover}
        />
      )}
    </div>
  );
};

export { Model };
