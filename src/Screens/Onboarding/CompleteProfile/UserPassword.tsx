import * as React from "react";
import { Formik, FormikProps } from "formik";

import { NewFormikPasswordField } from "Components";

import { userPasswordValidationSchema } from "./metaData";
import { CompleteMainLayout } from "./Style";
import { useProfileContext } from "./ProfileProvider";

export type FormValuesType = {
  password: string;
  confirmPassword: string;
};
export const UserPassword = () => {
  const { updateProfileData, openNextForm, password } = useProfileContext();

  const onFormSubmit = (values: FormValuesType) => {
    const { password } = values;
    updateProfileData("SET_PASSWORD", password);
    openNextForm();
  };
  return (
    <Formik initialValues={{ confirmPassword: password, password }} validationSchema={userPasswordValidationSchema} onSubmit={onFormSubmit}>
      {({ values, touched, errors, setFieldValue, setFieldTouched, isValid, handleSubmit, setValues: _setValues }: FormikProps<FormValuesType>) => {
        const { confirmPassword, password } = values;
        const handleFieldChange = (fieldName, value) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, value);
        };

        return (
          <CompleteMainLayout disabledNextButton={!(password && isValid)} progressPercentage={"97%"} title="Create your password." description="" nextBtnHandler={handleSubmit}>
            <NewFormikPasswordField
              fieldName="password"
              fieldProps={{
                label: "New Password",
                value: password,
                onChangeHandler: (value: string) => handleFieldChange("password", value),
                errorMessage: (touched.password && errors.password) || "",
                placeholder: "",
                testId: "password",
                inputFieldStyle: { marginTop: 50 },
              }}
            />
            <NewFormikPasswordField
              fieldName="confirmPassword"
              fieldProps={{
                label: "Confirm Password",
                value: confirmPassword,
                onChangeHandler: (value: string) => handleFieldChange("confirmPassword", value),
                errorMessage: (touched.confirmPassword && errors.confirmPassword) || "",
                placeholder: "",
                testId: "confirm-password",
                inputFieldStyle: { marginTop: 20 },
              }}
            />
          </CompleteMainLayout>
        );
      }}
    </Formik>
  );
};
