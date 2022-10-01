import { FC, useRef, useContext } from "react";
import { Formik, Form, Field } from "formik";
import PopoverOptions from "./PopoverOptions";
import Button from "./Button";
import { useClickAway } from "react-use";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import RouteContext from "../context/Route.context";
import type { FieldFormat, FieldType } from "@prisma/client";
import { HiOutlineCalendar } from "react-icons/hi";
import { BsClock } from "react-icons/bs";

type EditFieldPopoverPropTypes = {
  fieldId: string;
  name: string;
  type: "STRING" | "INT" | "BOOLEAN";
  array: boolean;
  optional: boolean;
  format: FieldFormat;
  setEditFieldPopover: (show: boolean) => void;
};

const EditFieldPopover: FC<EditFieldPopoverPropTypes> = ({
  fieldId,
  name,
  type,
  array,
  optional,
  format,
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
      format: FieldFormat;
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
        type: type as "STRING" | "INT" | "BOOLEAN",
        format: format as FieldFormat,
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
          format: values.format,
        });

        setEditFieldPopover(false);
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
                  // { name: "{ }", value: "COMPLEX" },
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
                    // { name: "3/12", value: "DATE" },
                    {
                      icon: <HiOutlineCalendar className="h-5 w-5" />,
                      value: "DATE",
                    },
                    // { name: "1:32", value: "DATE_TIME" },
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

              {/* <PopoverOptions
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
                /> */}
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
                className="text-md px-2 py-1 font-light text-[#969696] hover:text-red-500"
                type="button"
                onClick={() => {
                  deleteField.mutate({ fieldId });
                  setEditFieldPopover(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    // <Formik
    //   initialValues={{
    //     type: type,
    //     array: array,
    //     optional: optional,
    //     name: name,
    //     submit: false,
    //   }}
    //   onSubmit={(values) => {
    //     if (!values.submit) {
    //       return;
    //     }
    //     values.submit = false;

    //     updateField.mutate({
    //       fieldId: fieldId,
    //       name: values.name,
    //       type: values.type,
    //       array: values.array,
    //       optional: values.optional,
    //     });
    //   }}
    // >
    //   {({ values }) => (
    //     <Form>
    //       <div
    //         role="group"
    //         ref={ref}
    //         className="mx-1 mt-4 mb-6 flex flex-col rounded-xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-4 shadow-sm"
    //       >
    //         <div className="flex flex-row flex-wrap gap-x-4">
    //           <PopoverOptions
    //             fieldAlias="Type"
    //             fieldName="type"
    //             options={[
    //               { name: "ABC", value: "STRING" },
    //               { name: "123", value: "INT" },
    //               { name: "T/F", value: "BOOLEAN" },
    //             ]}
    //             defaultValue={values.type}
    //           />
    //           <PopoverOptions
    //             fieldAlias="Array"
    //             fieldName="array"
    //             options={[
    //               { name: "Yes", value: true },
    //               { name: "No", value: false },
    //             ]}
    //             defaultValue={values.array}
    //           />
    //           <PopoverOptions
    //             fieldAlias="Optional"
    //             fieldName="optional"
    //             options={[
    //               { name: "Yes", value: true },
    //               { name: "No", value: false },
    //             ]}
    //             defaultValue={values.optional}
    //           />
    //         </div>
    //         <div className="mt-4">
    //           <h1 className="mb-2 text-sm">Name</h1>
    //           <Field
    //             name="name"
    //             autoComplete="off"
    //             placeholder="field name"
    //             className="text-md h-[2.2rem] w-[60%] rounded-[0.3rem] border-[1px] border-[#E4E4E4] py-1.5 px-3 font-light text-[#969696] focus:outline-none focus:ring-2 focus:ring-[#F2F2F2]"
    //           />
    //         </div>
    //         {/* <div className="mt-6 flex flex-row gap-x-4">
    //           <Button
    //             name="Save"
    //             type="submit"
    //             onClick={() => {
    //               values.submit = true;
    //             }}
    //           />
    //           <Button
    //             name="Delete"
    //             type="button"
    //             onClick={() => {
    //               deleteField.mutate({ fieldId });
    //               setEditFieldPopover(false);
    //             }}
    //           />
    //         </div> */}
    //         <div className="mt-6 flex flex-row gap-x-2">
    //           <Button
    //             name="Save"
    //             type="submit"
    //             onClick={() => {
    //               values.submit = true;
    //             }}
    //           />
    //           {/* <Button
    //               name="Cancel"
    //               type="button"
    //               onClick={() => {
    //                 setAuthorizationFieldPopover(false);
    //               }}
    //             />*/}
    //           <button
    //             className="text-md px-2 py-1 font-light text-[#969696] hover:text-red-500"
    //             type="button"
    //             onClick={() => {
    //               deleteField.mutate({ fieldId });
    //               setEditFieldPopover(false);
    //             }}
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     </Form>
    //   )}
    // </Formik>
  );
};

export default EditFieldPopover;
