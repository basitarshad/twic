import * as React from "react";
import { View, KeyboardAvoidingView, Keyboard, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { connect } from "react-redux";
import { openInbox } from "react-native-email-link";
import { If, Then } from "react-if";
import * as yup from "yup";
import { Formik, FormikProps } from "formik";
import { PrimaryButton } from "twic_mobile_components";

import AppConstants from "Constants/AppConstants";
import { MagicLinkContainer, MagicLinkImage, PasswordUIWrapper } from "./StyledComponents";
import { AppText, AppAlert, AppHeading, AppScreenTitle } from "../../Components";
import { Images, Colors, Metrics, Fonts } from "../../Themes";
import { loginWithPassword, sendResetPasswordLinkToEmail } from "../../Actions";
import { useLoginContext } from "./loginContext";
import NewFormikPasswordField from "../../Components/Commons/FormFields/FormikFields/NewFormikPasswordField";
import { useAuthentication } from "./useAuthentication";
import { APP_ENDPOINTS } from "Services";
import { APP_CONSTANTS } from "Constants";

const ResetLinkComponent = ({ email, sendResetPasswordLinkToEmail }) => {
  const ResetPasswordConfirmationAlertOptions = {
    title: `We've sent a password reset email to ${email}.`,
    message: `Open your email and click on the link to reset your password.`,
    alertActions: [
      {
        text: "Done",
        onPress: () => console.log("Done"),
      },
      {
        text: "Open Mail",
        onPress: () => {
          openInbox({});
        },
      },
    ],
  };

  const ResetPasswordAlertOptions = {
    title: `Do you want to reset password for ${email}?`,
    message: `We will send you an email with instruction on how to reset the password.`,
    alertActions: [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("cancelled"),
      },
      {
        text: "Reset",
        onPress: () => {
          sendResetPasswordLinkToEmail({ email });
          AppAlert(ResetPasswordConfirmationAlertOptions);
        },
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={() => {
        AppAlert(ResetPasswordAlertOptions);
      }}
    >
      <AppText color={Colors.newBlue} testID="reset-password" accessibilityLabel={APP_CONSTANTS.IS_ANDROID ? "reset-password" : undefined}>
        Reset Password
      </AppText>
    </TouchableOpacity>
  );
};

const ResendMagicLinkConfirmationAlertOptions = {
  title: `We sent a new magic link to your email`,
  message: `Open your email and click on the link to login.`,
  alertActions: [
    {
      text: "Dismiss",
      onPress: () => console.log("Done"),
    },
  ],
};

type FormFieldsType = {
  password: string;
};

const passwordValidations = yup.object().shape({
  password: yup.string().required("Incorrect Password"),
});

const PasswordScreen = (props) => {
  const { loginWithPassword, sendResetPasswordLinkToEmail } = props;
  const { state, dispatcher } = useLoginContext();
  const { hasPassword = false, error = "", email } = state || {};
  const { sendApiLinkHandler } = useAuthentication({ url: APP_ENDPOINTS.SEND_MAGIC_LINK, email });
  React.useEffect(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <PasswordUIWrapper>
          <If condition={!hasPassword}>
            <View style={{ flex: 1 }}>
              <MagicLinkContainer>
                <MagicLinkImage source={Images.emailConfirmation} />
                <AppScreenTitle style={{ textAlign: "center" }}>Check your email for the magic link</AppScreenTitle>
                <AppText fontSize={Fonts.size.medium} textAlign="center" paddingTop={Metrics.baseMargin} paddingBottom={Metrics.doubleBaseMargin}>
                  We sent an email to <AppHeading>{email}</AppHeading>. Simply click on the magic link in the email to sign in.
                </AppText>
                <View style={{ alignItems: "center", marginTop: 30 }}>
                  <AppText color={Colors.charcoalLightGrey} style={{}}>
                    Can’t see the email?
                  </AppText>
                  <TouchableOpacity
                    onPress={() => {
                      sendApiLinkHandler();
                      AppAlert(ResendMagicLinkConfirmationAlertOptions);
                    }}
                  >
                    <AppText color={Colors.newBlue}>Resend</AppText>
                  </TouchableOpacity>
                </View>
              </MagicLinkContainer>
              <View style={{ justifyContent: "flex-end", alignItems: "center", marginBottom: 30 }}>
                <PrimaryButton
                  width={AppConstants.MUI_BTN_WIDTH}
                  shadowOptions={{ width: 0 }}
                  buttonColor={Colors.newPrimary}
                  buttonLabel="Open Email"
                  testId="open-email"
                  onClickHandler={() => {
                    openInbox({});
                  }}
                />
              </View>
            </View>
          </If>

          <If condition={hasPassword}>
            <Then>
              <View style={{ flex: 1, marginTop: APP_CONSTANTS.IS_ANDROID ? StatusBar.currentHeight : 0 }}>
                <AppHeading fontSize={20} paddingTop={APP_CONSTANTS.IS_ANDROID ? 20 : 15}>
                  Sign in to Forma
                </AppHeading>
                <AppText color={Colors.charcoalLightGrey} paddingTop={15}>
                  Securely sign in to your account. Forgot your login?
                </AppText>
                <ResetLinkComponent email={email} sendResetPasswordLinkToEmail={sendResetPasswordLinkToEmail} />
                <Formik
                  initialValues={{
                    password: "",
                  }}
                  validationSchema={passwordValidations}
                  onSubmit={(values: FormFieldsType) => loginWithPassword({ email, password: values.password, contextDispatcher: dispatcher })}
                >
                  {({ values, setFieldTouched, setFieldError, setFieldValue, handleSubmit, errors, touched, dirty, isValid }: FormikProps<FormFieldsType>) => {
                    const { password } = values;
                    React.useEffect(() => setFieldError("password", error), [error]);

                    const handleFieldChange = (fieldName, value) => {
                      setFieldTouched(fieldName, true);
                      setFieldValue(fieldName, value);
                    };
                    return (
                      <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, paddingTop: 40, justifyContent: "flex-start" }}>
                          <NewFormikPasswordField
                            fieldName="password"
                            fieldProps={{
                              label: "Enter your password",
                              value: password,
                              onChangeHandler: (value: string) => handleFieldChange("password", value),
                              errorMessage: (touched.password && errors.password) || "",
                              testId: "password-field",
                            }}
                          />
                        </View>
                        <View style={{ flex: 1, height: 90, justifyContent: "flex-end", paddingBottom: AppConstants.IS_ANDROID ? 20 : 10 }}>
                          <PrimaryButton
                            width={AppConstants.MUI_BTN_WIDTH}
                            shadowOptions={{ width: 0, height: 0 }}
                            buttonColor={Colors.newPrimary}
                            disabledColor={Colors.newDisabledPrimary}
                            disabled={Boolean(!isValid || !dirty)}
                            buttonLabel="Log In"
                            onClickHandler={handleSubmit}
                            testId="login-button"
                          />
                        </View>
                      </View>
                    );
                  }}
                </Formik>
              </View>
            </Then>
          </If>
        </PasswordUIWrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapDispatchTopProps = (dispatch) => {
  return {
    loginWithPassword: (params) => dispatch(loginWithPassword(params)),
    sendResetPasswordLinkToEmail: (params) => dispatch(sendResetPasswordLinkToEmail(params)),
  };
};

export default connect(null, mapDispatchTopProps)(PasswordScreen);
