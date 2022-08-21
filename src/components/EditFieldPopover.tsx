import { FC, useRef, useContext } from "react";
import { Formik, Form, Field } from "formik";
import PopoverOptions from "./PopoverOptions";
import Button from "./Button";
import { useClickAway } from "react-use";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import RouteContext from "../context/Route.context";

type EditFieldPopoverPropTypes = {
  fieldId: string;
  name: string;
  type: "STRING" | "INT" | "BOOLEAN";
  array: boolean;
  optional: boolean;
  setEditFieldPopover: (show: boolean) => void;
};

const EditFieldPopover: FC<EditFieldPopoverPropTypes> = ({
  fieldId,
  name,
  type,
  array,
  optional,
  setEditFieldPopover,
}) => {
  const ref = useRef(null);
  useClickAway(ref, () => {
    setEditFieldPopover(false);
  });

  const queryClient = useQueryClient();

  const { routeId } = useContext(RouteContext);

  const updateField = useMutation(
    (data: {
      fieldId: string;
      type: "STRING" | "INT" | "BOOLEAN";
      array: boolean;
      optional: boolean;
      name: string;
    }) => {
      return axios.post("http://localhost:3000/api/field/edit.field", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  const deleteField = useMutation(
    (data: { fieldId: string }) => {
      return axios.post("http://localhost:3000/api/field/delete.field", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  return (
    <Formik
      initialValues={{
        type: type,
        array: array,
        optional: optional,
        name: name,
        submit: false,
      }}
      onSubmit={(values) => {
        if (!values.submit) {
          return;
        }
        values.submit = false;

        updateField.mutate({
          fieldId: fieldId,
          name: values.name,
          type: values.type,
          array: values.array,
          optional: values.optional,
        });
      }}
    >
      {({ values }) => (
        <Form>
          <div
            role="group"
            ref={ref}
            className="mt-4 mb-6 flex flex-col rounded-2xl border-[1.5px] border-[#E4E4E4] bg-white px-6 pt-4 pb-6 shadow-sm"
          >
            <div className="flex flex-row flex-wrap gap-x-10">
              <PopoverOptions
                fieldAlias="Type"
                fieldName="type"
                options={[
                  { name: "ABC", value: "STRING" },
                  { name: "123", value: "INT" },
                  { name: "T/F", value: "BOOLEAN" },
                ]}
                defaultValue={values.type}
              />
              <PopoverOptions
                fieldAlias="Array"
                fieldName="array"
                options={[
                  { name: "Yes", value: true },
                  { name: "No", value: false },
                ]}
                defaultValue={values.array}
              />
              <PopoverOptions
                fieldAlias="Optional"
                fieldName="optional"
                options={[
                  { name: "Yes", value: true },
                  { name: "No", value: false },
                ]}
                defaultValue={values.optional}
              />
            </div>
            <div className="mt-4">
              <h1 className="mb-2">Name</h1>
              <Field
                name="name"
                autoComplete="off"
                placeholder="field name"
                className="rounded-lg border-[1.5px] border-[#E4E4E4] py-1.5 px-3 text-lg font-light focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
              />
            </div>
            <div className="mt-4 flex flex-row gap-x-4">
              <Button
                name="Save"
                type="submit"
                onClick={() => {
                  values.submit = true;
                }}
              />
              <Button
                name="Delete"
                type="button"
                onClick={() => {
                  deleteField.mutate({ fieldId });
                  setEditFieldPopover(false);
                }}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditFieldPopover;
