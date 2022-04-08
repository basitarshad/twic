import * as React from "react";
import { Image, View, Dimensions, Platform, StyleSheet } from "react-native";
import { checkNotifications, requestNotifications, openSettings } from "react-native-permissions";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import { AppScreenTitle, AppScreenTitleContainer, AppText, AppAlert, ScreenContainer } from "../../Components";
import { Metrics, Colors, Images, ApplicationStyles } from "../../Themes";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";

const NotificationPermissionScreen = (props) => {
  const [isPermissionAskedOnAndroid, setPermissionAskedOnAndroid] = React.useState(false);

  const openUserSettings = () => {
    openSettings().catch(() => console.warn("cannot open settings"));
  };

  // handler for asking notification permissions
  const askNotificationPermissions = () => {
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
      if (status === "blocked") {
        if (Platform.OS === "android") {
          isPermissionAskedOnAndroid ? openUserSettings() : AppAlert(notificationPermissionsOptions);
        } else {
          openUserSettings();
        }
      }
      if (status === "granted") {
        NavigationService.replaceScreen(APP_ROUTES.USER_NOTIFICATIONS_SETTINGS_SCREEN);
      }
    });
  };

  const notificationPermissionsOptions = {
    title: `Do you want to enable notifications for Forma?`,
    message: `We use notifications to alert you when a reimbursement has been completed or when there’s a security concern with your credit card.`,
    alertActions: [
      {
        text: `Don't Allow`,
        style: "cancel",
        onPress: () => console.log("cancelled"),
      },
      {
        text: "Allow",
        onPress: async () => {
          checkNotifications().then(({ status, settings }) => {
            setPermissionAskedOnAndroid(true);
            if (status === "granted") {
              NavigationService.replaceScreen(APP_ROUTES.USER_NOTIFICATIONS_SETTINGS_SCREEN);
            } else {
              openUserSettings();
            }
          });
        },
      },
    ],
  };

  return (
    <ScreenContainer>
      <AppScreenTitleContainer customStyle={{ paddingVertical: 0 }}>
        <AppScreenTitle textTransform="capitalize">Notifications</AppScreenTitle>
      </AppScreenTitleContainer>

      <View style={styles.mainContainer}>
        <View style={{ ...styles.headerContainer, flex: 1 }} />
        <View style={{ ...styles.contentContainer, flex: 7.5 }}>
          <View style={styles.notificationIllustrationContainer}>
            <Image source={Images.onboardingNotification} style={styles.notificationIllustration} />
          </View>
          <AppText paddingTop={Metrics.doubleBaseMargin} textAlign="center">
            Allow Forma to receive updates about your reimbursements, order status, account balance and more.
          </AppText>
        </View>

        <View
          style={{
            flex: 1.5,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            // paddingHorizontal: Metrics.baseMargin,
            paddingBottom: Metrics.baseMargin,
          }}
        >
          <SecondaryButton buttonLabel="Not Now" onClickHandler={() => NavigationService.goBackToPreviousScreen()} width={Metrics.screenWidth / 2.65} labelStyle={{ textAlign: "justify", color: Colors.newBlue }} />

          <PrimaryButton
            buttonLabel="Enable Notifications"
            width={Metrics.screenWidth / 2}
            shadowOptions={{
              width: 0,
            }}
            buttonColor={Colors.newPrimary}
            onClickHandler={() => askNotificationPermissions()}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: ApplicationStyles.mainContainer,
  notificationIllustrationContainer: {
    marginTop: Metrics.doubleBaseMargin,
    alignItems: "center",
  },
  notificationIllustration: {
    resizeMode: "contain",
    height: Platform.OS === "android" ? Dimensions.get("screen").width / 3 : 100,
    marginBottom: Metrics.doubleBaseMargin,
  },
  headerContainer: {
    paddingTop: Metrics.doubleBaseMargin * 2.5,
  },
  contentContainer: {
    paddingTop: Metrics.doubleBaseMargin * 2.5,
  },
});

export default NotificationPermissionScreen;
