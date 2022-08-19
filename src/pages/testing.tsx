import type { NextPage } from "next";
import { Formik, Form, Field } from "formik";
import PopoverOptions from "../components/PopoverOptions";
import Button from "../components/Button";

const Testing: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Formik
        initialValues={{
          type: "" as "STRING" | "INT" | "BOOLEAN",
          array: false,
          optional: false,
          name: "",
          submit: false,
        }}
        onSubmit={async (values) => {
          if (!values.submit) {
            return;
          }
          values.submit = false;
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ values }) => (
          <Form>
            <div
              role="group"
              className="flex flex-col rounded-2xl border-[1.5px] border-[#E4E4E4] px-6 pt-4 pb-6"
            >
              <div className="flex flex-row gap-x-4">
                <PopoverOptions
                  fieldAlias="Type"
                  fieldName="type"
                  options={[
                    { name: "ABC", value: "STRING" },
                    { name: "123", value: "INT" },
                    { name: "T/F", value: "BOOLEAN" },
                  ]}
                />
                <PopoverOptions
                  fieldAlias="Array"
                  fieldName="array"
                  options={[
                    { name: "Yes", value: true },
                    { name: "No", value: false },
                  ]}
                />
                <PopoverOptions
                  fieldAlias="Optional"
                  fieldName="optional"
                  options={[
                    { name: "Yes", value: true },
                    { name: "No", value: false },
                  ]}
                />
              </div>
              <div className="mt-4">
                <h1 className="mb-2">Name</h1>
                <Field
                  name="name"
                  autocomplete="off"
                  placeholder="userId"
                  className="w-3/4 rounded-lg border-[1.5px] border-[#E4E4E4] py-1.5 px-3 text-lg font-light"
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
                  name="Cancel"
                  type="button"
                  onClick={() => {
                    values.submit = true;
                  }}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Testing;
