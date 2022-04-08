import * as React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import CookieManager from "react-native-cookies";

import { AppScreenTitle, AppText, AppAlert } from "Components";
import { AsyncStorageService, initAPIConfig } from "Services";
import { Metrics, Colors, Images } from "Themes";
import { updateAppCurrentStack, updateUserPushNotificationToken } from "Actions";
import { BugsnagAnalytics } from "AppAnalytics";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

import { APP_ROUTES } from "../../Navigation";
import { useNextScreen } from "./Common";
import { ButtonLabel } from "./Styles";
import { APP_CONSTANTS } from "Constants";

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

const WelcomeComponent = () => {
  const { openNextScreen } = useNextScreen({ activeScreen: "OnboardingScreen" });

  return (
    <View style={{ flex: 1 }}>
      <Image source={Images.welcomeHero} style={{ height: 290, resizeMode: "contain", width: Metrics.screenWidth, marginTop: -35 }} />
      <AppScreenTitle style={{ textAlign: "center" }} marginTop={30}>
        Welcome to Forma
      </AppScreenTitle>
      <AppText style={{ textAlign: "center", marginHorizontal: 30 }} marginTop={30} color={Colors.charcoalLightGrey}>
        We give you the flexibility to spend your benefits how you want. Manage life and work seamlessly.
      </AppText>
      <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}>
        <TouchableOpacity onPress={openNextScreen}>
          <ButtonLabel>Next</ButtonLabel>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OnboardingScreen = () => {
  const dispatch = useDispatch();
  return (
    <ScreenWrapper scrollView={false} screenContainerStyle={{ paddingRight: 0, paddingLeft: 0, paddingTop: APP_CONSTANTS.IS_ANDROID ? 5 : 0 }}>
      <SimpleHeaderBackHandler marginLeft={16} height={44} backhandler={() => AppAlert(LogoutAlertOptions((routeName) => dispatch(updateAppCurrentStack(routeName))))} containerProps={{ zIndex: 1 }} />
      <WelcomeComponent />
    </ScreenWrapper>
  );
};

export default OnboardingScreen;
