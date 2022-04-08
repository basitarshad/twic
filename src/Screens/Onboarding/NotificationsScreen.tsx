import * as React from "react";
import { Image, View, Dimensions, Platform } from "react-native";
import { connect } from "react-redux";
import { checkNotifications, requestNotifications, openSettings } from "react-native-permissions";
import { Then, Else, If } from "react-if";

import { AppScreenTitle, PrimaryButton, AppScreenTitleContainer, AppText, AppAlert, ScreenContainer } from "../../Components";
import { Metrics, Colors, Images } from "../../Themes";
import { styles } from "./Styles";
import { updateUserProfile, updateUserNotificationSettings } from "../../Actions";
import { NOTIFICATION_SETTINGS } from "../../Constants";

const NotificationsScreen = (props) => {
  const { route, updateUserProfile, updateUserNotificationSettings } = props;
  const profile = route.params.profile || {};
  const [isNextButtonVisible, setNextButtonVisibility] = React.useState(false);
  const [isPermissionAskedOnAndroid, setPermissionAskedOnAndroid] = React.useState(false);

  const openUserSettings = () => {
    openSettings().catch(() => console.warn("cannot open settings"));
  };

  React.useEffect(() => {
    checkNotifications().then(({ status, settings }) => {
      if (status === "granted") {
        toggleNotificationChannels(true);
        setNextButtonVisibility(true);
      }
    });
  }, []);

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
        toggleNotificationChannels(true);
      }
    });
  };

  const notificationPermissionsOptions = {
    title: `Do you want to enable notifications for Forma?`,
    message: `We use notifications to alert you when a reimbursement has been completed or when there’s a security concern with your credit card.`,
    alertActions: [
      {
        text: `Don't Alllow`,
        style: "cancel",
        onPress: () => console.log("cancelled"),
      },
      {
        text: "Allow",
        onPress: async () => {
          checkNotifications().then(({ status, settings }) => {
            setPermissionAskedOnAndroid(true);
            if (status === "granted") {
              toggleNotificationChannels(true);
            } else {
              openUserSettings();
              //askNotificationPermissions()
            }
          });
        },
      },
    ],
  };

  const toggleNotificationChannels = async (isEnabledOrNot) => {
    let payload = [] as any;

    Object.values(NOTIFICATION_SETTINGS).forEach((setting) => {
      const { type, channel } = setting;
      const channels = Object.entries(channel).map(([key, value]) => ({ channel: key, value: isEnabledOrNot }));
      payload.push({ type: type, channels: channels });
    });
    await updateUserNotificationSettings(payload);
    setNextButtonVisibility(true);
  };

  return (
    <ScreenContainer>
      <AppScreenTitleContainer>
        <AppScreenTitle textTransform="capitalize">Notifications</AppScreenTitle>
      </AppScreenTitleContainer>

      <View style={styles.mainContainer}>
        <View style={{ ...styles.headerContainer, flex: 1 }}></View>
        <View style={{ ...styles.contentContainer, flex: 7.5 }}>
          <View style={styles.notificationIllustrationContainer}>
            <Image source={Images.onboardingNotification} style={styles.notificationIllustration} />
          </View>
          <AppText paddingTop={Metrics.doubleBaseMargin} textAlign="center">
            Allow Forma to receive updates about your reimbursements, order status, account balance and more.
          </AppText>
        </View>

        <If condition={isNextButtonVisible}>
          <Then>
            <View style={{ flex: 1.5 }}>
              <PrimaryButton
                buttonLabel="Next"
                fullWidth
                //loading={isLoading}
                disabled={false}
                buttonColor={Colors.primary}
                onClickHandler={() => updateUserProfile(profile)}
              />
            </View>
          </Then>
          <Else>
            <View
              style={{
                flex: 1.5,
                justifyContent: "space-between",
                flexDirection: "row",
                paddingHorizontal: Metrics.baseMargin,
              }}
            >
              <PrimaryButton
                buttonLabel="Not Now"
                labelStyle={{ color: Colors.charcoalDarkGrey }}
                buttonShadowColor={Colors.charcoalDarkGrey}
                width={Dimensions.get("window").width / 3.75}
                buttonColor={Colors.white}
                onClickHandler={() => toggleNotificationChannels(false)}
              />
              <PrimaryButton buttonStyle={{ marginLeft: Metrics.baseMargin }} buttonLabel="Enable Notifications" width={Dimensions.get("window").width / 2} buttonColor={Colors.primary} onClickHandler={() => askNotificationPermissions()} />
            </View>
          </Else>
        </If>
      </View>
    </ScreenContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (profile) => dispatch(updateUserProfile(profile)),
    updateUserNotificationSettings: (notificationSettings) => dispatch(updateUserNotificationSettings(notificationSettings)),
  };
};

export default connect(null, mapDispatchToProps)(NotificationsScreen);
