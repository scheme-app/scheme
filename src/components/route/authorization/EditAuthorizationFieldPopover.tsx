import { FC, useRef, useContext } from "react";
import { Formik, Form } from "formik";
import { Button, PopoverOptions } from "@components/shared";
import { useClickAway } from "react-use";
import RouteContext from "@/context/Route.context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type EditAuthorizationFieldPopoverPropTypes = {
  authorization: "NONE" | "API_KEY" | "BEARER" | "BASIC" | "DIGEST" | "OAUTH";
  setAuthorizationFieldPopover: (show: boolean) => void;
};

const EditAuthorizationFieldPopover: FC<
  EditAuthorizationFieldPopoverPropTypes
> = ({ authorization, setAuthorizationFieldPopover }) => {
  const ref = useRef(null);
  useClickAway(ref, () => {
    setAuthorizationFieldPopover(false);
  });

  const { routeId } = useContext(RouteContext);

  const queryClient = useQueryClient();

  const updateAuthorizationField = useMutation(
    (data: {
      authorization:
        | "NONE"
        | "API_KEY"
        | "BEARER"
        | "BASIC"
        | "DIGEST"
        | "OAUTH";
    }) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/route/updateAuthorization.route`,
        {
          routeId: routeId,
          ...data,
        }
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
          type: authorization as
            | "NONE"
            | "API_KEY"
            | "BEARER"
            | "BASIC"
            | "DIGEST"
            | "OAUTH",
          submit: false,
        }}
        onSubmit={(values) => {
          if (!values.submit) {
            return;
          }
          values.submit = false;

          updateAuthorizationField.mutate({
            authorization: values.type,
          });

          setAuthorizationFieldPopover(false);
        }}
      >
        {({ values }) => (
          <Form>
            <div
              role="group"
              ref={ref}
              className="mx-1 mt-4 mb-6 flex flex-col rounded-xl border-[1px] border-[#E4E4E4] bg-white px-6 pt-4 pb-4 shadow-sm"
            >
              <div className="flex flex-row flex-wrap gap-x-4">
                <PopoverOptions
                  fieldAlias="Type"
                  fieldName="type"
                  options={[
                    { name: "None", value: "NONE" },
                    { name: "API Key", value: "API_KEY" },
                    { name: "Bearer", value: "BEARER" },
                    { name: "Basic", value: "BASIC" },
                    { name: "Digest", value: "DIGEST" },
                    { name: "OAuth", value: "OAUTH" },
                  ]}
                  defaultValue={values.type}
                />
              </div>
              <div className="mt-8 flex flex-row gap-x-2">
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
                  onClick={() => {
                    setAuthorizationFieldPopover(false);
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

export default EditAuthorizationFieldPopover;
