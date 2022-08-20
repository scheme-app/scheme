import { FC, useState } from "react";
import Field from "./Field";
import CreateFieldPopover from "./CreateFieldPopover";
import ComplexField from "./ComplexField";

type ParentModelPropTypes = {
  id: string;
  name: string;
  fields: Array<{
    id: string;
    name: string;
    type: "STRING" | "INT" | "BOOLEAN" | "COMPLEX";
    array: boolean;
    optional: boolean;
  }>;
};

const ParentModel: FC<ParentModelPropTypes> = ({ id, name, fields }) => {
  const [showCreateFieldPopover, setShowCreateFieldPopover] = useState(false);

  return (
    <div className="mt-8 flex flex-col">
      <h1 className="text-xl font-light">{name}</h1>

      {fields.map(({ id, name, type, array, optional }) => {
        if (type !== "COMPLEX") {
          return (
            <Field
              id={id}
              name={name}
              type={type}
              array={array}
              optional={optional}
            />
          );
        } else {
          return (
            <ComplexField
              id={id}
              name={name}
              array={array}
              optional={optional}
            />
          );
        }
      })}
      {!showCreateFieldPopover && (
        <button
          className="mt-8"
          onClick={() => {
            setShowCreateFieldPopover(!showCreateFieldPopover);
          }}
        >
          Create Field
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

export default ParentModel;
