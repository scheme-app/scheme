//react
import { FC, useContext, useRef } from "react";
//context
// import RouteContext from "@/context/RouteContext";
import RouteContext from "@/context/Route.context";
//formik
import { Formik, Form, Field } from "formik";
//data fetching
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
//components
import { Button, PopoverOptions } from "@components/shared";
//icons
import { HiOutlineCalendar } from "react-icons/hi";
import { BsClock } from "react-icons/bs";
//types
import type { FieldFormat, FieldType } from "@prisma/client";
//misc
import { useClickAway } from "react-use";

type CreateFieldPopoverPropTypes = {
  modelId: string;
  setCreateFieldPopover: (show: boolean) => void;
};

const CreateFieldPopover: FC<CreateFieldPopoverPropTypes> = ({
  modelId,
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
      modelId: string;
      type: FieldType;
      array: boolean;
      optional: boolean;
      name: string;
      format: FieldFormat;
    }) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/field/create.field`,

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
    <Formik
      initialValues={{
        type: "STRING" as FieldType,
        format: "NONE" as FieldFormat,
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

        createField.mutate({
          modelId: modelId,
          type: values.type,
          array: values.array,
          optional: values.optional,
          name: values.name,
          format: values.format,
        });

        setCreateFieldPopover(false);
      }}
    >
      {({ values }) => (
        <Form>
          <div
            role="group"
            className="mx-1 mt-4 mb-6 flex flex-col rounded-xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-4 shadow-sm"
          >
            <div className="flex flex-row flex-wrap gap-x-4">
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
              {values.type === "STRING" && (
                <PopoverOptions
                  fieldAlias="Format"
                  fieldName="format"
                  options={[
                    { name: "None", value: "NONE" },
                    { name: "B64", value: "BYTE" },
                    { name: "1011", value: "BINARY" },
                    {
                      icon: <HiOutlineCalendar className="h-5 w-5" />,
                      value: "DATE",
                    },
                    {
                      icon: <BsClock className="h-5 w-5" />,
                      value: "DATE_TIME",
                    },
                    { name: "****", value: "Password", css: "mt-1.5" },
                  ]}
                  defaultValue={values.format}
                />
              )}
              {values.type === "INT" && (
                <PopoverOptions
                  fieldAlias="Format"
                  fieldName="format"
                  options={[
                    { name: "None", value: "NONE" },
                    { name: "int32", value: "INT32" },
                    { name: "int64", value: "INT64" },
                    { name: "Float", value: "FLOAT" },
                    { name: "Double", value: "DOUBLE" },
                  ]}
                  defaultValue={values.format}
                />
              )}
              {values.type === "BOOLEAN" && (
                <>
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
                </>
              )}
            </div>
            <div className="mt-4 flex flex-row gap-x-6">
              <div className="h-full">
                <h1 className="mb-2 text-sm">Name</h1>
                <Field
                  name="name"
                  autoComplete="off"
                  placeholder="field name"
                  className="text-md h-[2.15rem] rounded-[0.3rem] border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
                />
              </div>
              {values.type !== "BOOLEAN" && (
                <>
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
                </>
              )}
            </div>
            <div className="mt-8 flex flex-row gap-x-2">
              <Button
                name="Add"
                type="submit"
                style="primary"
                onClick={() => {
                  values.submit = true;
                }}
              />
              <Button
                name="Cancel"
                type="button"
                style="secondary"
                onClick={() => {
                  setCreateFieldPopover(false);
                }}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export { CreateFieldPopover };
