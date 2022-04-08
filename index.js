/**
 * @format
 */

import * as React from "react";
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./dist/App";
import { PushNotificationService, AsyncStorageService } from "./dist/Services";
import { APP_CONSTANTS } from "./dist/Constants";
import { name as appName } from "./app.json";
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
// GLOBAL.FormData = GLOBAL.originalFormData || GLOBAL.FormData;

// Disabling yellow warnings in app
console.disableYellowBox = true;
// console.warn = () => { };

// Register background handler for push notifications
PushNotificationService.pushNotificationBackgroundHandler();

// Used to perform actions on push notification when app is killed or in background
AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.APP_LOADED);
const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
