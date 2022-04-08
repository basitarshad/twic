import * as React from "react";
import { Formik, FormikProps } from "formik";

import { NewFormikInputField } from "Components";

import { userNameValidationSchema } from "./metaData";
import { CompleteMainLayout } from "./Style";
import { useProfileContext } from "./ProfileProvider";

const initialFormValues = {
  firstName: "",
  lastName: "",
};
export type FormValuesType = {
  firstName: string;
  lastName: string;
};
export const UserName = () => {
  const { updateProfileData, openNextForm, firstName, lastName } = useProfileContext();
  const onFormSubmit = (values: FormValuesType) => {
    const { firstName, lastName } = values;
    updateProfileData("SET_USER_NAME", { firstName, lastName });
    openNextForm();
  };

  return (
    <Formik initialValues={{ firstName, lastName }} validationSchema={userNameValidationSchema} onSubmit={onFormSubmit}>
      {({ values, touched, errors, setFieldValue, setFieldTouched, handleSubmit, setValues: _setValues, isValid }: FormikProps<FormValuesType>) => {
        const { firstName, lastName } = values;
        const handleFieldChange = (fieldName, value) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, value);
        };

        return (
          <CompleteMainLayout disabledNextButton={!(firstName && isValid)} progressPercentage={"97%"} title="Let’s finish setting up your Forma benefits account." description="Please complete your profile information." nextBtnHandler={handleSubmit}>
            <NewFormikInputField
              fieldName="firstName"
              fieldProps={{
                label: "First Name",
                value: firstName,
                onChangeHandler: (name: string) => handleFieldChange("firstName", name),
                placeholder: "",
                errorMessage: (touched.firstName && errors.firstName) || "",
                testId: "first-name",
                inputFieldStyle: { marginTop: 50 },
              }}
            />
            <NewFormikInputField
              fieldName="lastName"
              fieldProps={{
                label: "Last Name",
                value: lastName,
                onChangeHandler: (name: string) => handleFieldChange("lastName", name),
                placeholder: "",
                errorMessage: (touched.lastName && errors.lastName) || "",
                testId: "last-name",
                inputFieldStyle: { marginTop: 20 },
              }}
            />
          </CompleteMainLayout>
        );
      }}
    </Formik>
  );
};
