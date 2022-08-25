import { FC } from "react";
import ComplexModelField from "./ComplexModelField";
import * as ScrollArea from "@radix-ui/react-scroll-area";

const fields: Array<{
  id: string;
  name: string;
  type: "STRING" | "INT" | "BOOLEAN";
  array: boolean;
  optional: boolean;
}> = [
  { id: "id", name: "id", type: "STRING", array: false, optional: false },
  { id: "name", name: "name", type: "STRING", array: false, optional: false },
  { id: "age", name: "age", type: "INT", array: false, optional: false },
  { id: "id", name: "id", type: "STRING", array: false, optional: false },
  { id: "name", name: "name", type: "STRING", array: false, optional: false },
  { id: "age", name: "age", type: "INT", array: false, optional: false },
  { id: "id", name: "id", type: "STRING", array: false, optional: false },
  { id: "name", name: "name", type: "STRING", array: false, optional: false },
  { id: "age", name: "age", type: "INT", array: false, optional: false },
  { id: "id", name: "id", type: "STRING", array: false, optional: false },
  { id: "name", name: "name", type: "STRING", array: false, optional: false },
  { id: "age", name: "age", type: "INT", array: false, optional: false },
];

// type PropTypes = {
//   parentFieldName: string;
//   fields: Array<{
//     id: string;
//     name: string;
//     type: "STRING" | "INT" | "BOOLEAN";
//     array: boolean;
//     optional: boolean;
//   }>;
// };

type PropTypes = {
  setShowComplexModelViewer: (showComplexModelViewer: boolean) => void;
};

const ComplexModelViewer: FC<PropTypes> = ({ setShowComplexModelViewer }) => {
  return (
    <div className="absolute bottom-0 flex h-[39rem] w-[60%] flex-col rounded-t-3xl border-t-[1.5px] border-l-[1.5px] border-r-[1.5px] border-[#E4E4E4] bg-white px-8 pt-8">
      <div className="flex flex-row justify-between pb-8">
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border-[1.5px] border-[#E4E4E4] bg-[#F2F2F2]">
            <h1 className="mb-0.5 text-lg font-light text-[#969696]">
              {"{ }"}
            </h1>
          </div>
          <div className="flex flex-row gap-x-2">
            <h1 className=" font-light italic tracking-wider text-[#969696]">
              user /
            </h1>
            <h1 className="font-light tracking-wide text-black underline">
              createUser
            </h1>
          </div>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md border-[1.5px] border-[#E4E4E4] hover:bg-[#F2F2F2]"
          onClick={() => {
            setShowComplexModelViewer(false);
          }}
        >
          <h1 className="mb-2 text-[#969696]">...</h1>
        </button>
      </div>
      <div>
        <ScrollArea.Root>
          <ScrollArea.Viewport className="h-[32rem] w-full">
            {fields.map(({ id, name, type, array, optional }) => (
              <ComplexModelField
                key={id}
                id={id}
                name={name}
                type={type}
                array={array}
                optional={optional}
              />
            ))}
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Viewport>
        </ScrollArea.Root>
      </div>
    </div>
  );
};

export default ComplexModelViewer;
