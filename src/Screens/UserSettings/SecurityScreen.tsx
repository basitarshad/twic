import * as React from "react";
import { View, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";
import { Formik, FormikProps } from "formik";
import * as yup from "yup";
import { PrimaryButton } from "twic_mobile_components";

import { changeAccountPassword } from "Actions";
import { AppHeading, AppScreenTitleContainer, AppScreenTitle, NewFormikPasswordField } from "Components";
import { Metrics, Colors, Fonts } from "Themes";
import { isEmptyOrNil } from "Utils";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_CONSTANTS } from "Constants";

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

const ChangePasswordView = (props: { changeAccountPassword: (params) => void }) => {
  const { changeAccountPassword } = props;

  const onSubmitForm = async (values, actions: any) => {
    const updatedKeys = {
      new_password: values.newPassword,
      confirm_password: values.confirmNewPassword,
      password: values.oldPassword,
    };
    await changeAccountPassword(updatedKeys);
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
      onSubmit={(values, actions: any) => onSubmitForm(values, actions)}
    >
      {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }) => {
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
            <NewFormikPasswordField
              fieldName="oldPassword"
              fieldProps={{
                label: "Old Password",
                value: oldPassword,
                onChangeHandler: (value: string) => handleFieldChange("oldPassword", value),
                errorMessage: (touched.oldPassword && errors.oldPassword) || "",
                testId: "old-password",
              }}
            />
            <NewFormikPasswordField
              fieldName="newPassword"
              fieldProps={{
                label: "New Password",
                value: newPassword,
                onChangeHandler: (value: string) => handleFieldChange("newPassword", value),
                errorMessage: (touched.newPassword && errors.newPassword) || "",
                testId: "new-password",
              }}
              containerStyle={{ marginTop: 25 }}
            />
            <NewFormikPasswordField
              fieldName="confirmNewPassword"
              fieldProps={{
                label: "Confirm New Password",
                value: confirmNewPassword,
                onChangeHandler: (value: string) => handleFieldChange("confirmNewPassword", value),
                errorMessage: (touched.confirmNewPassword && errors.confirmNewPassword) || "",
                testId: "confirm-password",
              }}
              containerStyle={{ marginTop: 25 }}
            />
            <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: APP_CONSTANTS.IS_ANDROID ? 20 : 10 }}>
              <PrimaryButton
                testId="change-password-save-button"
                width={APP_CONSTANTS.MUI_BTN_WIDTH}
                buttonColor={Boolean(!isValid || !dirty) ? Colors.newDisabledPrimary : Colors.newPrimary}
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

const SecurityScreen = () => {
  const sso = useSelector((state) => pathOr({}, ["userProfile", "companyInfo", "sso"], state));
  const dispatch = useDispatch();

  if (!isEmptyOrNil(sso)) return null;
  return (
    <ScreenWrapper scrollView={false} newDesignSystem screenContainerStyle={{ paddingTop: 10, flex: 1 }}>
      <AppScreenTitle>Security</AppScreenTitle>
      <View style={{ marginBottom: Metrics.doubleBaseMargin, flex: 1 }}>
        <ChangePasswordView changeAccountPassword={(params) => dispatch(changeAccountPassword(params))} />
      </View>
    </ScreenWrapper>
  );
};

export default SecurityScreen;
