import * as React from "react";
import { Field } from "formik";

import { default as InputField, InputFieldProps } from "../InputField";

type FormikInputField = {
  fieldName: string;
  fieldProps: InputFieldProps;
};
const FormikInputField = (props: FormikInputField) => {
  const { fieldName, fieldProps } = props;
  const _InputField = React.useCallback(() => {
    return <InputField {...fieldProps} />;
  }, [fieldProps]);

  return (
    <Field name={fieldName}>
      {() => {
        return _InputField();
      }}
    </Field>
  );
};

export default FormikInputField;
