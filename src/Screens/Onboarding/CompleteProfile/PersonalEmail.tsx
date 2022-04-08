import * as React from "react";
import { Formik, FormikProps } from "formik";

import { AppText, NewFormikInputField } from "Components";
import { Colors } from "Themes";

import { personalEmailValidationSchema } from "./metaData";
import { CompleteMainLayout } from "./Style";
import { useProfileContext } from "./ProfileProvider";

export type FormValuesType = {
  personalEmail: string;
};

export const PersonalEmail = () => {
  const { updateProfileData, openNextForm, personalEmail } = useProfileContext();
  const onFormSubmit = (values: FormValuesType) => {
    const { personalEmail } = values;
    updateProfileData("SET_PERSONAL_EMAIL", personalEmail);
    openNextForm();
  };

  return (
    <Formik initialValues={{ personalEmail }} validationSchema={personalEmailValidationSchema} onSubmit={onFormSubmit}>
      {({ values, touched, errors, setFieldValue, setFieldTouched, handleSubmit, isValid }: FormikProps<FormValuesType>) => {
        const { personalEmail } = values;
        const handleFieldChange = (fieldName, value) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, value);
        };
        const checkmarkIconProps =
          !!personalEmail && isValid
            ? {
                rightIconName: "check-circle",
                iconProps: {
                  color: Colors.success,
                  size: 24,
                },
              }
            : {};

        return (
          <CompleteMainLayout
            disabledNextButton={!(personalEmail && isValid)}
            progressPercentage={"97%"}
            title="Let’s finish setting up your Forma benefits account."
            description="Please complete your profile information."
            nextBtnHandler={handleSubmit}
          >
            <NewFormikInputField
              fieldName="personalEmail"
              fieldProps={{
                label: "Personal Email",
                value: personalEmail,
                onChangeHandler: (name: string) => handleFieldChange("personalEmail", name),
                placeholder: "",
                errorMessage: (touched.personalEmail && errors.personalEmail) || "",
                testId: "personal-email",
                inputFieldStyle: { marginTop: 50 },
                ...checkmarkIconProps,
              }}
            />
            <AppText color={Colors.charcoalLightGrey} marginTop={5}>
              We will only use your personal email to contact you if we can’t reach your work email.
            </AppText>
          </CompleteMainLayout>
        );
      }}
    </Formik>
  );
};
