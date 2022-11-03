import { FC } from "react";
import { Formik, Form, Field } from "formik";
import { Button } from "@components/shared";
import { HiArrowNarrowRight } from "react-icons/hi";

type EditFolderDialogPropTypes = {
  folderId: string;
  name: string;
};

const EditFolderDialog: FC<EditFolderDialogPropTypes> = ({
  folderId,
  name,
}) => {
  return (
    <Formik
      initialValues={{
        name: name,
        submit: false,
      }}
      onSubmit={(values) => {
        if (!values.submit) {
          return;
        }
        values.submit = false;
      }}
    >
      {({ values }) => (
        <Form>
          <div
            role="group"
            className="mt-2 mb-6 flex flex-col rounded-2xl border-[1.5px] border-[#E4E4E4] bg-white px-6 pt-4 pb-8 pr-20 shadow-sm"
          >
            <div className="mb-2 flex flex-row items-center gap-x-2">
              <h1 className="text-[#969696]">{name}</h1>
              <HiArrowNarrowRight className="text-[#969696]" />
              <h1 className="text-[#969696]">{values.name}</h1>
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
            <div className="mt-8 flex flex-row gap-x-4">
              <Button
                name="Save"
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
                onClick={() => {}}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditFolderDialog;
