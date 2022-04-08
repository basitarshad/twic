import * as React from "react";
import { View, Image } from "react-native";
import { connect } from "react-redux";
import * as yup from "yup";
import { Formik } from "formik";
import CookieManager from "react-native-cookies";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { PrimaryButton, AppHeading, FormikInputField, HeaderCircularBackHandler, AppAlert, ScreenContainer } from "Components";
import { Images, Colors, Metrics } from "Themes";
import { NavigationService, AsyncStorageService, initAPIConfig } from "Services";
import { BugsnagAnalytics } from "AppAnalytics";
import { updateAppCurrentStack, updateUserPushNotificationToken } from "Actions";

import { styles } from "./Styles";
import { APP_ROUTES } from "../../Navigation";

const LogoutAlertOptions = (updateAppCurrentStack) => ({
  title: `Forma Log out`,
  message: `Do you want to log out from Forma?`,
  alertActions: [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => console.log("cancelled"),
    },
    {
      text: "Yes",
      onPress: async () => {
        await AsyncStorageService.clearAsyncStorage();
        BugsnagAnalytics.clearBugsnagUser();
        CookieManager.clearAll();
        await updateUserPushNotificationToken();

        initAPIConfig({ isLoggedIn: false, authToken: "" });
        updateAppCurrentStack(APP_ROUTES.AUTH_STACK);
      },
    },
  ],
});

const profileFormValidations = () => {
  return yup.object().shape({
    first_name: yup.string().required("First name is required."),
    last_name: yup.string().required("Last name is required."),
  });
};

const ProfileForm = (props) => {
  const { userProfile } = props;
  const { userInfo } = userProfile;
  const { firstName, lastName } = userInfo;
  const profile = { first_name: firstName, last_name: lastName };

  return (
    <Formik initialValues={profile} onSubmit={(values) => NavigationService.navigate(APP_ROUTES.ONBOARDING_NOTIFICATION, { profile: values })} validationSchema={profileFormValidations}>
      {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
        <>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" enableOnAndroid={true} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              <FormikInputField
                fieldName={"first_name"}
                fieldProps={{
                  label: "First Name",
                  value: values.first_name,
                  onChangeHandler: handleChange("first_name"),
                  onBlurHandler: () => setFieldTouched("first_name"),
                  keyboardType: "default",
                  errorMessage: touched.first_name && errors.first_name ? (errors.first_name as string) : "",
                }}
              />
              <FormikInputField
                fieldName={"last_name"}
                fieldProps={{
                  label: "Last Name",
                  value: values.last_name,
                  onChangeHandler: handleChange("last_name"),
                  onBlurHandler: () => setFieldTouched("last_name"),
                  keyboardType: "default",
                  errorMessage: touched.last_name && errors.last_name ? (errors.last_name as string) : "",
                }}
              />
            </View>
            <View style={{ paddingBottom: Metrics.doubleBaseMargin * 2, paddingTop: Metrics.baseMargin, alignItems: "center" }}>
              <PrimaryButton buttonLabel="Next" fullWidth disabled={!isValid} buttonColor={!isValid ? Colors.disabledPrimary : Colors.primary} onClickHandler={handleSubmit} />
            </View>
          </KeyboardAwareScrollView>
        </>
      )}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

const ConnectedProfileForm = connect(mapStateToProps, null)(ProfileForm);

const ProfileConfirmationScreen = (props) => {
  const { updateAppCurrentStack } = props;

  return (
    <ScreenContainer>
      <View style={styles.mainContainer}>
        <HeaderCircularBackHandler
          buttonStyle={{
            zIndex: 1,
            marginLeft: Metrics.screenHorizontalPadding,
            marginTop: Metrics.smallMargin,
            position: "absolute",
          }}
          onPressHandler={() => AppAlert(LogoutAlertOptions(updateAppCurrentStack))}
        />
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image source={Images.appLogo} style={styles.logo} />
          </View>
          <AppHeading paddingTop={Metrics.doubleBaseMargin * 2} fontSize={28}>
            Confirm your Forma Profile Information
          </AppHeading>
        </View>
        <ConnectedProfileForm />
      </View>
    </ScreenContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAppCurrentStack: (RouteName) => dispatch(updateAppCurrentStack(RouteName)),
  };
};
export default connect(null, mapDispatchToProps)(ProfileConfirmationScreen);
