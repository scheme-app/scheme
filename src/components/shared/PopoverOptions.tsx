import { useField } from "formik";
import React, { FC, useState } from "react";
import * as Separator from "@radix-ui/react-separator";

type PopoverOptionPropTypes = {
  icon?: React.ReactElement;
  name?: string;
  value: string | boolean;
  css?: string;
  active: string | boolean;
  setActive: (value: string | boolean) => void;
  setValue: (value: string | boolean) => void;
};

const PopoverOption: FC<PopoverOptionPropTypes> = ({
  icon,
  name,
  value,
  css,
  active,
  setActive,
  setValue,
}) => {
  return (
    <button
      className={`text-md px-2.5 font-light text-[#969696] ${
        active === value ? "bg-[#F2F2F2]" : ""
      }`}
      onClick={() => {
        setActive(value);
        setValue(value);
      }}
    >
      {name ? <h1 className={css}>{name}</h1> : icon}
    </button>
  );
};

const PopoverSeperator: FC = () => {
  return (
    <Separator.Root
      decorative
      orientation="vertical"
      className="h-8 w-[0.09rem] bg-[#E4E4E4]"
    />
  );
};

type PopoverOptionsPropTypes = {
  fieldAlias: string;
  fieldName: string;
  options: Array<{
    icon?: React.ReactElement;
    name?: string;
    value: string | boolean;
    css?: string;
  }>;
  defaultValue: string | boolean;
};

const PopoverOptions: FC<PopoverOptionsPropTypes> = ({
  fieldAlias,
  fieldName,
  options,
  defaultValue,
}) => {
  const [field, meta, helpers] = useField(fieldName);
  const [active, setActive] = useState<string | boolean>(defaultValue);

  const { setValue } = helpers;

  return (
    <div>
      <h1 className="mb-2 text-sm">{fieldAlias}</h1>
      <div className="overflow-hidden rounded-[0.4rem] border-[1px] border-[#E4E4E4]">
        <div className="flex flex-row">
          {options.map((option, i) => {
            if (i !== options.length - 1) {
              return (
                <div className="flex flex-row" key={i}>
                  <PopoverOption
                    // key={i}
                    icon={option.icon}
                    name={option.name}
                    value={option.value}
                    css={option.css}
                    active={active}
                    setActive={setActive}
                    setValue={setValue}
                  />
                  <PopoverSeperator />
                </div>
              );
            }
            return (
              <PopoverOption
                key={i}
                icon={option.icon}
                name={option.name}
                value={option.value}
                css={option.css}
                active={active}
                setActive={setActive}
                setValue={setValue}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { PopoverOptions };
