import * as React from "react";
import { Dimensions } from "react-native";
import { Formik, FormikProps } from "formik";
import * as yup from "yup";
import { connect } from "react-redux";
import { View } from "react-native-animatable";

import { AppHeading, AppScreenTitleContainer, PrimaryButton } from "Components";
import { Colors, Fonts, Metrics } from "Themes";
import { changeAccountPassword } from "Actions";
import FormikPasswordField from "Components/Commons/FormFields/FormikFields/FormikPasswordField";
import { ChangePasswordFormFieldsType, ChangePasswordFormattedFieldsType } from "./types";

const buttonWidth = Dimensions.get("screen").width - 20;

const changePasswordValidations = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup.string().min(12, "New password must be 12 characters long").required("New password is required"),
  confirmNewPassword: yup
    .string()
    .required("Confirm password is required")
    .test("match", "Re-entered password must match the new password", function (confirmPassword) {
      return confirmPassword === this.parent.newPassword;
    }),
});

const ChangePasswordView = (props: { changeAccountPassword: (params: ChangePasswordFormattedFieldsType) => void }) => {
  const { changeAccountPassword } = props;

  const onSubmitForm = async (values: ChangePasswordFormFieldsType, actions: any) => {
    const updatedKeys = {
      new_password: values.newPassword,
      confirm_password: values.confirmNewPassword,
      password: values.oldPassword,
    };
    await changeAccountPassword({ ...updatedKeys });
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }}
      validationSchema={changePasswordValidations}
      onSubmit={(values: ChangePasswordFormFieldsType, actions: any) => onSubmitForm(values, actions)}
    >
      {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<ChangePasswordFormFieldsType>) => {
        const { oldPassword, newPassword, confirmNewPassword } = values;
        const handleFieldChange = (fieldName, value) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, value);
        };
        return (
          <>
            <AppScreenTitleContainer
              customStyle={{
                paddingVertical: 0,
                marginBottom: Metrics.baseMargin + 6,
                paddingHorizontal: 0,
                fontWeight: 600,
              }}
            >
              <AppHeading fontSize={Fonts.size.medium} textTransform="capitalize" paddingTop={Metrics.doubleBaseMargin} fontWeight={"bold"}>
                Change Password
              </AppHeading>
            </AppScreenTitleContainer>
            <FormikPasswordField
              fieldName="oldPassword"
              fieldProps={{
                label: "Old Password",
                value: oldPassword,
                onChangeHandler: (value: string) => handleFieldChange("oldPassword", value),
                errorMessage: (touched.oldPassword && errors.oldPassword) || "",
                testId: "old-password",
              }}
            />
            <FormikPasswordField
              fieldName="newPassword"
              fieldProps={{
                label: "New Password",
                value: newPassword,
                onChangeHandler: (value: string) => handleFieldChange("newPassword", value),
                errorMessage: (touched.newPassword && errors.newPassword) || "",
                testId: "new-password",
              }}
            />
            <FormikPasswordField
              fieldName="confirmNewPassword"
              fieldProps={{
                label: "Confirm New Password",
                value: confirmNewPassword,
                onChangeHandler: (value: string) => handleFieldChange("confirmNewPassword", value),
                errorMessage: (touched.confirmNewPassword && errors.confirmNewPassword) || "",
                testId: "confirm-password",
              }}
            />
            <View style={{ alignItems: "center" }}>
              <PrimaryButton
                testId="change-password-save-button"
                fullWidth
                width={buttonWidth}
                buttonColor={Boolean(!isValid || !dirty) ? Colors.disabledPrimary : Colors.primary}
                disabled={Boolean(!isValid || !dirty)}
                onClickHandler={handleSubmit}
                buttonLabel="Save"
              />
            </View>
          </>
        );
      }}
    </Formik>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeAccountPassword: (params) => dispatch(changeAccountPassword(params)),
  };
};

export default connect(null, mapDispatchToProps)(ChangePasswordView);
