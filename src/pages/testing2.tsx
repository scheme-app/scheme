import type { NextPage } from "next";
import { Formik, Form } from "formik";
import PopoverOptions from "../components/PopoverOptions";

const Testing: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Formik
        initialValues={{
          type: "" as "STRING" | "INT" | "BOOLEAN",
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
              className="flex flex-col rounded-lg border-[1.5px] border-[#E4E4E4] p-3"
            >
              <PopoverOptions
                fieldName="type"
                options={[
                  { name: "ABC", value: "STRING" },
                  { name: "123", value: "INT" },
                  { name: "T/F", value: "BOOLEAN" },
                ]}
              />
            </div>
            <div>Picked: {values.type}</div>
            <button
              type="submit"
              onClick={() => {
                values.submit = true;
              }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Testing;
