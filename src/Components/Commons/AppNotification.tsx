import * as React from "react";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Icon from "react-native-vector-icons/AntDesign";

import { Metrics, Colors, Images } from "../../Themes";
import { Image, StatusBar } from "react-native";
import { APP_CONSTANTS } from "Constants";
import AppConstants from "Constants/AppConstants";

type NotificationParams = {
  message: string;
  description: string;
  autoHide?: boolean;
  duration?: number;
  onPressHandler?(): void;
};

const togglePushNotification = (params: NotificationParams) => {
  const { message, description, autoHide = true, onPressHandler } = params;
  showMessage({
    message: message,
    description: description,
    type: "default",
    onPress: onPressHandler,
    backgroundColor: Colors.white, // background color
    color: Colors.black, // text color
    textStyle: {
      width: Metrics.screenWidth - Metrics.doubleBaseMargin * 4,
    },
    icon: "default",
    ...(autoHide ? { duration: 3500 } : { autoHide: false }),
  });
};

const toggleSuccessNotification = (params: NotificationParams) => {
  const { message, description, autoHide = true } = params;
  showMessage({
    message: message,
    description: description,
    type: "default",
    backgroundColor: Colors.white, // background color
    color: Colors.black, // text color
    textStyle: {
      width: Metrics.screenWidth - Metrics.doubleBaseMargin * 4,
    },
    // @ts-ignore
    textProps: {
      testID: "success-notification-text",
      accessibilityLabel: "success-notification-text",
    },
    titleProps: {
      testID: "success-notification-title",
      accessibilityLabel: "success-notification-title",
    },
    icon: "success",
    ...(autoHide ? { duration: 5000 } : { autoHide: false }),
  });
};

const toggleErrorNotification = (params: NotificationParams) => {
  const { message, description, autoHide = true } = params;
  showMessage({
    message: message,
    description: description,
    type: "default",
    backgroundColor: Colors.white, // background color
    color: Colors.black, // text color
    textStyle: {
      width: Metrics.screenWidth - Metrics.doubleBaseMargin * 4,
    },
    // @ts-ignore
    textProps: {
      testID: "error-notification-text",
      accessibilityLabel: "error-notification-text",
    },
    titleProps: {
      testID: "error-notification-title",
      accessibilityLabel: "error-notification-title",
    },
    icon: "danger",
    ...(autoHide ? { duration: 7000 } : { autoHide: false }),
  });
};

const FlashMessageIcon = (props) => {
  const isDefault = props === "default";
  if (isDefault) return <Image source={Images.notificationIconForma} style={{ height: 32, width: 32, marginRight: Metrics.baseMargin, marginTop: Metrics.baseMargin - 3 }} />;
  const iconName = props === "success" ? "checkcircleo" : "closecircleo";
  const color = props === "success" ? Colors.green : Colors.error;
  return <Icon name={iconName} style={{ color: color, fontSize: 40, paddingRight: Metrics.baseMargin }} />;
};

const AppFlashMessage = () => {
  return (
    <FlashMessage
      position="top"
      statusBarHeight={AppConstants.IS_ANDROID ? StatusBar.currentHeight : undefined}
      renderFlashMessageIcon={FlashMessageIcon}
      style={{
        // borderBottomRightRadius: Metrics.baseMargin,
        // borderBottomLeftRadius: Metrics.baseMargin,
        borderBottomColor: APP_CONSTANTS.IS_ANDROID ? Colors.newLightGrey : "",
        borderBottomWidth: APP_CONSTANTS.IS_ANDROID ? 0.5 : 0,
        shadowColor: Colors.lightGrey,
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 2,
        elevation: 2,
      }}
    />
  );
};

export default {
  AppFlashMessage,
  toggleSuccessNotification,
  toggleErrorNotification,
  togglePushNotification,
};
