import * as React from "react";
import { connect } from "react-redux";
import { KeyboardAvoidingView, Platform } from "react-native";
import { propOr } from "ramda";
import CookieManager from "react-native-cookies";

import { initializeAppData } from "../../Actions";
import { isEmptyOrNil, getQueryParams } from "../../Utils";
import { initAPIConfig, AsyncStorageService, NavigationService } from "../../Services";
import { APP_CONSTANTS } from "../../Constants";
import { APP_ROUTES } from "../../Navigation";
import WebViewScreen from "../WebViewScreen";
import { useLoginContext } from "./loginContext";
import { ScreenContainer } from "../../Components";

const _checkNeededCookies = async ({ cookies, initializeAppData, url }) => {
  const authToken: string = propOr("", "x-auth-token", cookies);
  const resetToken = getQueryParams(url, "token");

  if (url.includes("reset")) {
    if (!isEmptyOrNil(resetToken) && !isEmptyOrNil(cookies)) {
      NavigationService.replaceScreen(APP_ROUTES.AUTH_SELECTION_SCREEN);
      NavigationService.navigate(APP_ROUTES.RESET_PASSWORD_SCREEN, { resetToken, authToken });
    }
    return;
  }

  if (!isEmptyOrNil(authToken)) {
    await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.AUTH_TOKEN, authToken);
    initAPIConfig({ isLoggedIn: true, authToken });
    CookieManager.clearAll();
    initializeAppData();
    NavigationService.replaceScreen(APP_ROUTES.AUTH_SELECTION_SCREEN);
  } else {
    initAPIConfig({ isLoggedIn: false, authToken: "" });
  }
};

const LoginWithSsoScreen = (props) => {
  const { initializeAppData, route } = props;
  const [cookies, setCookies] = React.useState({});
  const [webViewVisible, setWebviewVisible] = React.useState(false);

  const { state } = useLoginContext();
  const { redirectUrl = "" } = state || {};

  const uriFromParam = route.params.uri || "";
  const uri = !isEmptyOrNil(uriFromParam) ? uriFromParam : redirectUrl;
  const _onMessage = (event) => {
    const { data, url } = event.nativeEvent;
    const cookiesResponse = data.split(";"); // `csrftoken=...; rur=...; mid=...; somethingelse=...`
    if (!isEmptyOrNil(data)) {
      cookiesResponse.forEach((cookie) => {
        const c = cookie.trim().split("=");
        const new_cookies = cookies;
        new_cookies[c[0]] = c[1];
        setCookies(new_cookies);
      });
    }
    _checkNeededCookies({ cookies, initializeAppData, url });
  };

  const isMagicOrResetLink = (link) => {
    const KEYWORDS = ["magic", "reset"];
    return KEYWORDS.some((key) => link.toLowerCase().includes(key.toLowerCase()));
  };

  //only for sso login
  const webViewVisibleForSpecificLink = ({ jsEvaluationValue, title }) => {
    if (jsEvaluationValue && jsEvaluationValue === "(null)" && title === "Twic | Wellness Intelligence") {
      setWebviewVisible(false);
    } else if (jsEvaluationValue && jsEvaluationValue === "(null)") {
      setWebviewVisible(true);
    } else {
      setWebviewVisible(true);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.select({ android: "padding" })} enabled contentContainerStyle={{ flex: 1 }} keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })} style={{ flexGrow: 1 }}>
        <WebViewScreen
          source={{ uri }}
          style={{ flex: webViewVisible ? 1 : 0 }}
          onMessage={_onMessage}
          onNavigationStateChange={(params) => webViewVisibleForSpecificLink(params)}
          injectedJavaScript={"ReactNativeWebView.postMessage(document.cookie)"}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          scalesPageToFit={true}
          automaticallyAdjustContentInsets={false}
          mixedContentMode={"compatibility"}
          //when link is expire
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            if (nativeEvent.statusCode === 500 && isMagicOrResetLink(uri)) setWebviewVisible(true);
          }}
          userAgent={"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"}
          // sharedCookiesEnabled={false}
          cacheEnabled={false}
          //autoManageStatusBarEnabled={false}
          cacheMode="LOAD_NO_CACHE"
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    initializeAppData: () => dispatch(initializeAppData()),
  };
};
export default connect(null, mapDispatchToProps)(LoginWithSsoScreen);
