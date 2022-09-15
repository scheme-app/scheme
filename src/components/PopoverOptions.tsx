import { useField } from "formik";
import { FC, useState } from "react";
import * as Separator from "@radix-ui/react-separator";

type PopoverOptionPropTypes = {
  name: string;
  value: string | boolean;
  active: string | boolean;
  setActive: (value: string | boolean) => void;
  setValue: (value: string | boolean) => void;
};

const PopoverOption: FC<PopoverOptionPropTypes> = ({
  name,
  value,
  active,
  setActive,
  setValue,
}) => {
  return (
    <button
      className={`px-3 text-lg font-light text-[#969696] ${
        active === value ? "bg-[#F2F2F2]" : ""
      }`}
      onClick={() => {
        setActive(value);
        setValue(value);
      }}
    >
      {name}
    </button>
  );
};

const PopoverSeperator: FC = () => {
  return (
    <Separator.Root
      decorative
      orientation="vertical"
      className="h-10 w-[0.09rem] bg-[#E4E4E4]"
    />
  );
};

type PopoverOptionsPropTypes = {
  fieldAlias: string;
  fieldName: string;
  options: Array<{
    name: string;
    value: string | boolean;
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
      <h1 className="mb-2">{fieldAlias}</h1>
      <div className="overflow-hidden rounded-lg border-[1.5px] border-[#E4E4E4]">
        <div className="flex flex-row">
          {options.map((option, i) => {
            if (i !== options.length - 1) {
              return (
                <div className="flex flex-row">
                  <PopoverOption
                    key={option.name}
                    name={option.name}
                    value={option.value}
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
                key={option.name}
                name={option.name}
                value={option.value}
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

export default PopoverOptions;
