import { FC, useContext, useRef } from "react";
import { Formik, Form, Field } from "formik";
import PopoverOptions from "../components/PopoverOptions";
import Button from "../components/Button";
import { useClickAway } from "react-use";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import RouteContext from "../context/Route.context";

type CreateFieldPopoverPropTypes = {
  parentModelId: string;
  setCreateFieldPopover: (show: boolean) => void;
};

const CreateFieldPopover: FC<CreateFieldPopoverPropTypes> = ({
  parentModelId,
  setCreateFieldPopover,
}) => {
  const ref = useRef(null);
  useClickAway(ref, () => {
    setCreateFieldPopover(false);
  });

  const queryClient = useQueryClient();

  const { routeId } = useContext(RouteContext);

  const createField = useMutation(
    (data: {
      parentModelId: string;
      type: "STRING" | "INT" | "BOOLEAN";
      array: boolean;
      optional: boolean;
      name: string;
    }) => {
      return axios.post(
        "http://localhost:3000/api/field/createScalar.field",
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  const createComplexField = useMutation(
    (data: {
      routeId: string;
      parentModelId: string;
      type: "COMPLEX";
      array: boolean;
      optional: boolean;
      name: string;
    }) => {
      return axios.post(
        "http://localhost:3000/api/field/createComplex.field",
        data
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([routeId]);
      },
    }
  );

  return (
    <div>
      <Formik
        initialValues={{
          type: "STRING" as "STRING" | "INT" | "BOOLEAN" | "COMPLEX",
          array: false,
          optional: false,
          name: "",
          submit: false,
        }}
        onSubmit={(values) => {
          if (!values.submit) {
            return;
          }
          values.submit = false;

          if (values.type !== "COMPLEX") {
            createField.mutate({
              parentModelId: parentModelId,
              type: values.type,
              array: values.array,
              optional: values.optional,
              name: values.name,
            });
          } else {
            createComplexField.mutate({
              routeId: routeId,
              parentModelId: parentModelId,
              type: values.type,
              array: values.array,
              optional: values.optional,
              name: values.name,
            });
          }

          setCreateFieldPopover(false);
        }}
      >
        {({ values }) => (
          <Form>
            <div
              role="group"
              className="mx-1 mt-4 mb-6 flex flex-col rounded-2xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-4 shadow-sm"
            >
              <div className="flex flex-row flex-wrap gap-x-4">
                <PopoverOptions
                  fieldAlias="Type"
                  fieldName="type"
                  options={[
                    { name: "ABC", value: "STRING" },
                    { name: "123", value: "INT" },
                    { name: "T/F", value: "BOOLEAN" },
                    // { name: "{ }", value: "COMPLEX" },
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
              {/* <div className="mt-4">
                <h1 className="mb-2">Name</h1>
                <Field
                  name="name"
                  autoComplete="off"
                  placeholder="field name"
                  className="rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-3 text-lg font-light focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                />
              </div> */}
              <div className="mt-4">
                <h1 className="mb-2 text-sm">Name</h1>
                <Field
                  name="name"
                  autoComplete="off"
                  placeholder="field name"
                  className="text-md w-[60%] rounded-lg border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                />
              </div>
              {/* <div className="mt-4 flex flex-row gap-x-4">
                <Button
                  name="Save"
                  type="submit"
                  onClick={() => {
                    values.submit = true;
                  }}
                />
                <Button
                  name="Cancel"
                  type="button"
                  onClick={() => {
                    setCreateFieldPopover(false);
                  }}
                />*/}

              <div className="mt-6 flex flex-row gap-x-2">
                <Button
                  name="Save"
                  type="submit"
                  onClick={() => {
                    values.submit = true;
                  }}
                />
                {/* <Button
                  name="Cancel"
                  type="button"
                  onClick={() => {
                    setAuthorizationFieldPopover(false);
                  }}
                />*/}
                <button
                  className="text-md px-2 py-1 font-light text-[#969696] hover:text-black"
                  type="button"
                  onClick={() => {
                    setCreateFieldPopover(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateFieldPopover;
