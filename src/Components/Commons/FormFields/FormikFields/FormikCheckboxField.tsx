import * as React from "react";
import { Field } from "formik";
import CheckBoxButton from "../CheckBoxButton";
import { FormikCheckboxFieldType } from "./types";

const FormikCheckboxField = (props: FormikCheckboxFieldType) => {
  const { fieldName, fieldProps } = props;
  const _CheckBoxField = React.useCallback(() => {
    return <CheckBoxButton {...props} />;
  }, [fieldProps]);

  return (
    <Field name={fieldName}>
      {() => {
        return _CheckBoxField();
      }}
    </Field>
  );
};

export default FormikCheckboxField;
