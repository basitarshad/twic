import * as React from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { Formik, FormikProps } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "twic_mobile_components";

import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import AppConstants from "Constants/AppConstants";
import { AppHeading } from "../../Components";
import { Colors, Metrics } from "../../Themes";
import { resetAccountPassword } from "../../Actions";
import NewFormikPasswordField from "../../Components/Commons/FormFields/FormikFields/NewFormikPasswordField";
import { NavigationService } from "../../Services";

import { ResetPasswordBtnWrapper, ResetPasswordScreenBodyContainer, ResetPasswordScreenContainer, ResetPasswordScreenHeaderContainer } from "./StyledComponents";

type FormFieldsType = {
  newPassword: string;
  confirmNewPassword: string;
};

const changePasswordValidations = yup.object().shape({
  newPassword: yup.string().required("New password is required").min(12, "Password must be at least 12 characters."),
  confirmNewPassword: yup
    .string()
    .required("Confirm password is required")
    .test("match", "Re-entered password must match the new password", function (confirmPassword) {
      return confirmPassword === this.parent.newPassword;
    }),
});

const ResetPasswordForm = (props) => {
  const { authToken, resetToken } = props;
  const dispatch = useDispatch();

  const onSubmitForm = async (values: FormFieldsType, actions: any) => {
    const updatedKeys = {
      new_password: values.newPassword,
      confirm_password: values.confirmNewPassword,
      password: "",
      reset_token: resetToken,
      authToken,
    };
    await dispatch(resetAccountPassword({ ...updatedKeys }));
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{
        newPassword: "",
        confirmNewPassword: "",
      }}
      validationSchema={changePasswordValidations}
      onSubmit={(values: FormFieldsType, actions: any) => onSubmitForm(values, actions)}
    >
      {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<FormFieldsType>) => {
        const { newPassword, confirmNewPassword } = values;
        const handleFieldChange = (fieldName, value) => {
          setFieldTouched(fieldName, true);
          setFieldValue(fieldName, value);
        };
        return (
          <>
            <NewFormikPasswordField
              fieldName="newPassword"
              fieldProps={{
                label: "New Password",
                value: newPassword,
                onChangeHandler: (value: string) => handleFieldChange("newPassword", value),
                errorMessage: (touched.newPassword && errors.newPassword) || "",
                placeholder: "",
                testId: "new-password",
              }}
              containerStyle={{ marginTop: 0 }}
            />
            <NewFormikPasswordField
              fieldName="confirmNewPassword"
              fieldProps={{
                label: "Confirm New Password",
                value: confirmNewPassword,
                onChangeHandler: (value: string) => handleFieldChange("confirmNewPassword", value),
                errorMessage: (touched.confirmNewPassword && errors.confirmNewPassword) || "",
                placeholder: "",
                testId: "confirm-password",
              }}
              containerStyle={{ marginTop: 25 }}
            />
            <ResetPasswordBtnWrapper>
              <PrimaryButton
                testId="save-button"
                width={Metrics.screenWidth - 32}
                shadowOptions={{
                  height: 0,
                  width: 0,
                }}
                buttonColor={Boolean(!isValid || !dirty) ? Colors.disabledPrimary : Colors.newPrimary}
                disabled={Boolean(!isValid || !dirty)}
                onClickHandler={handleSubmit}
                buttonLabel="Save"
              />
            </ResetPasswordBtnWrapper>
          </>
        );
      }}
    </Formik>
  );
};

const ResetPasswordScreen = (props) => {
  const { route } = props;
  const resetToken = route.params.resetToken || "";
  const authToken = route.params.authToken || "";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ResetPasswordScreenContainer>
          <SimpleHeaderBackHandler backhandler={() => NavigationService.goBackToFirstScreenOfStack()} marginLeft={0} />
          <ResetPasswordScreenHeaderContainer>
            <AppHeading paddingTop={0} fontSize={28} testID="reset-password" accessibilityLabel="reset-password">
              Reset Password
            </AppHeading>
          </ResetPasswordScreenHeaderContainer>
          <ResetPasswordScreenBodyContainer>
            <ResetPasswordForm resetToken={resetToken} authToken={authToken} />
          </ResetPasswordScreenBodyContainer>
        </ResetPasswordScreenContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
