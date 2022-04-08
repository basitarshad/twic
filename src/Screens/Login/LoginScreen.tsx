import * as React from "react";
import { View, KeyboardAvoidingView } from "react-native";
import { propOr, propEq } from "ramda";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField, PrimaryButton } from "twic_mobile_components";

import AppConstants from "Constants/AppConstants";

import { AppHeading, AppText } from "../../Components";
import { NavigationService, APP_ENDPOINTS } from "../../Services";
import { isEmptyOrNil } from "../../Utils";
import APP_ROUTES from "../../Navigation/AppRoutes";
import { Colors, Metrics } from "../../Themes";
import { toggleAppScreenLoader } from "../../Actions";
import { useLoginContext } from "./loginContext";
import { useAuthentication } from "./useAuthentication";

const getEmailError = (email) => (!/^[\w-']+(\.[\w-']+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i.test(email) && !isEmptyOrNil(email) ? "Invalid e-mail address" : "");

const AppAccessError = "Company does not allow mobile app access";
const LoginScreen = (props) => {
  const { toggleAppLoader, route } = props;
  const authType = route.params.authType || "";
  const { dispatcher } = useLoginContext();

  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const isMagicLink = authType === "magicLink";
  const endpoint = isMagicLink ? APP_ENDPOINTS.SEND_MAGIC_LINK : APP_ENDPOINTS.GET_IDENTITY;
  const { data, error, loading, sendApiLinkHandler } = useAuthentication({ url: endpoint, email });

  React.useEffect(() => {
    if (error || isEmptyOrNil(data) || loading) return;
    const { data: resp } = data;
    const { redirect } = resp;
    const hasPassword = propEq("log_in_method", "password", resp);

    const payload = {
      email,
      hasPassword,
      hasUrl: propOr(false, "url", resp),
      redirectUrl: propOr("", "redirect", resp),
      sso: !hasPassword,
    };

    const NEXT_ROUTE = !isEmptyOrNil(redirect) ? APP_ROUTES.LOGIN_WITH_SSO : APP_ROUTES.PASSWORD_SCREEN;
    dispatcher({ type: "UPDATE_LOGIN_STATE", payload });

    NavigationService.navigate(NEXT_ROUTE);
  }, [data, error]);

  React.useEffect(() => {
    if (error) {
      if (error.response?.data?.message === AppAccessError) {
        NavigationService.navigate(APP_ROUTES.APP_ACCESS_ERROR);
      } else {
        setErrorMessage("e-mail address not found.");
      }
    }
  }, [error]);

  React.useEffect(() => {
    toggleAppLoader(loading);
  }, [loading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={{ flex: 1, marginTop: 60, paddingHorizontal: Metrics.newScreenHorizontalPadding }}>
          <View style={{ flex: 1 }}>
            <AppHeading fontSize={20}>What’s your work email address?</AppHeading>
            <AppText color={Colors.charcoalLightGrey} paddingTop={15} paddingBottom={50}>
              {isMagicLink ? "To get started, we’ll need your work email to verify your identity." : "Enter your work email to sign in to Forma."}
            </AppText>
            <InputField
              label={"Your work email"}
              value={email}
              onChangeHandler={(email) => {
                setEmail(email);
                setErrorMessage(getEmailError(email));
              }}
              errorMessage={errorMessage}
              keyboardType="email-address"
              testId="work-email-field"
            />
          </View>
          <View style={{ justifyContent: "flex-end", marginBottom: AppConstants.IS_ANDROID ? 20 : 10, height: 70 }}>
            <PrimaryButton
              buttonColor={Colors.newPrimary}
              disabledColor={Colors.newDisabledPrimary}
              disabled={!isEmptyOrNil(errorMessage) || isEmptyOrNil(email)}
              buttonLabel="Continue"
              onClickHandler={sendApiLinkHandler}
              testId="work-email-button"
              width={AppConstants.MUI_BTN_WIDTH}
              shadowOptions={{ width: 0 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapDispatchTopProps = (dispatch) => {
  return {
    toggleAppLoader: (param) => dispatch(toggleAppScreenLoader(param)),
  };
};

export default connect(null, mapDispatchTopProps)(LoginScreen);
