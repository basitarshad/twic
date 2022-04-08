import * as React from "react";
import { connect } from "react-redux";
import { Linking } from "react-native";

import { AsyncStorageService, initAPIConfig, NavigationService } from "../Services";
import { isEmptyOrNil, handleExternalLink } from "../Utils";
import APP_ROUTES from "../Navigation/AppRoutes";
import { APP_CONSTANTS } from "../Constants";
import { initializeAppData, updateAppCurrentStack } from "../Actions";

/**
 * determine if the use has already logged in by fetching the auth token from the async storage of the device
 */

const isLoggedIn = async (initializeApp, updateAppCurrentStack) => {
  const authToken = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.AUTH_TOKEN);
  const isLoggedIn = !isEmptyOrNil(authToken);

  initAPIConfig({ isLoggedIn, authToken });
  //if user is already logged in, then routing is set in (initializeAppData) action else redirected to app stack
  isLoggedIn ? await initializeApp() : updateAppCurrentStack(APP_ROUTES.AUTH_STACK);
};

const AuthLoadingScreen = (props) => {
  const { initializeApp, updateAppCurrentStack } = props;
  const handleInitialization = (url, callback) => {
    if (!isEmptyOrNil(url)) {
      updateAppCurrentStack(APP_ROUTES.AUTH_STACK);
      handleExternalLink({
        url,
        callback,
      });
    } else {
      // console.log('app not initialized from link')
      callback();
    }
  };

  React.useEffect(() => {
    const callbackToInitializeApp = async () => {
      await isLoggedIn(initializeApp, updateAppCurrentStack);
    };

    // this handles the case where the app is closed and is launched
    Linking.getInitialURL()
      .then((url) => {
        initAPIConfig({ isLoggedIn: false, authToken: "" });
        handleInitialization(url, callbackToInitializeApp);
      })
      .catch((e) => console.log("error in linking url: ", e));

    // This listener handles the case where the app is woken up from the Universal or Deep Linking
    Linking.addEventListener("url", (event) => handleInitialization(event.url, callbackToInitializeApp));
  }, []);

  // remove event listener on component unmount
  React.useEffect(() => {
    return () => {
      Linking.removeEventListener("url", (event) => handleInitialization(event.url, () => {}));
    };
  });

  return null;
};

const mapDispatchToProps = (dispatch) => {
  return {
    initializeApp: () => dispatch(initializeAppData()),
    updateAppCurrentStack: (RouteName) => dispatch(updateAppCurrentStack(RouteName)),
  };
};
export default connect(null, mapDispatchToProps)(AuthLoadingScreen);
