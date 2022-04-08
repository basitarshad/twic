import * as React from "react";
import { useDispatch } from "react-redux";
import CookieManager from "react-native-cookies";
import { View } from "react-native";

import { AppNotification } from "Components/Commons";
import Colors from "Themes/Colors";
import { initializeAppData, getTokenFromMagicLink } from "Actions";
import { APP_CONSTANTS } from "Constants";
import { isEmptyOrNil } from "Utils";
import { initAPIConfig, AsyncStorageService, NavigationService } from "Services";

import { APP_ROUTES } from "../../Navigation";

const CheckNeededCookies = async ({ authToken, initializeAppData }) => {
  if (!isEmptyOrNil(authToken)) {
    await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.AUTH_TOKEN, authToken);
    initAPIConfig({ isLoggedIn: true, authToken });
    CookieManager.clearAll();
    initializeAppData();
  } else {
    AppNotification.toggleErrorNotification({
      message: "Error",
      description: "There has been some problem with Magic link. Kindly re-generate it or contact support team.",
    });
    NavigationService.navigate(APP_ROUTES.AUTH_SELECTION_SCREEN);
  }
};

export const LoginWithMagicLinkScreen = (props) => {
  const { route } = props;
  const id = route.params.id || "";
  const token = route.params.authToken || "";
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getMagicLink = async () => {
      const authToken = await dispatch(getTokenFromMagicLink(id, token));
      !isEmptyOrNil(authToken) && CheckNeededCookies({ authToken: authToken, initializeAppData: () => dispatch(initializeAppData()) });
    };
    getMagicLink();
  }, []);
  return <View style={{ flex: 1, backgroundColor: Colors.white }} />;
};
