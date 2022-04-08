import * as React from "react";
import { Image } from "react-native";
import CookieManager from "react-native-cookies";
import Icon from "react-native-vector-icons/AntDesign";
import { checkNotifications } from "react-native-permissions";
import { map } from "ramda";
import { openExternalLink } from "Utils";
import { OrderSvgIcon, ExternalLinkSvgIcon, LockSvgIcon, ChatSvgIcon } from "../../Components/SvgIcons";
import { Images, Colors, Metrics } from "../../Themes";
import { AsyncStorageService, initAPIConfig, NavigationService } from "../../Services";
import { BugsnagAnalytics, displayIntercom } from "../../AppAnalytics";
import { APP_ROUTES } from "../../Navigation";
import { AppAlert } from "../../Components";
import { updateUserPushNotificationToken } from "../../Actions";
import { UserDependentBasicInfoType } from "../../types";
import { isEmptyOrNil } from "../../Utils";

const DELETE_ACCOUNT_URL = "https://www.requesteasy.com/5dfe-0936";

const LogoutAlertOptions = (updateAppCurrentStack: (stackName: string) => void) => {
  return {
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
          // if (Platform.OS === "android") {
          //   await FitnessService.disconnectGoogleFit();
          // }
          await AsyncStorageService.clearAsyncStorage();
          BugsnagAnalytics.clearBugsnagUser();
          CookieManager.clearAll();
          await updateUserPushNotificationToken();

          initAPIConfig({ isLoggedIn: false, authToken: "" });
          updateAppCurrentStack(APP_ROUTES.AUTH_STACK);
        },
      },
    ],
  };
};
const notificationsPermissions = () => {
  checkNotifications().then(({ status, settings }) => {
    let route = status != "granted" ? APP_ROUTES.NOTIFICATION_PERMISSION_SCREEN : APP_ROUTES.USER_NOTIFICATIONS_SETTINGS_SCREEN;
    NavigationService.navigate(route);
  });
};

export const iconStyle = {
  height: Metrics.icons.regular,
  width: Metrics.icons.regular,
};

type SettingsList = Array<{
  title: string;
  id: string;
  showHeader?: boolean;
  hideLastSeparator?: boolean;
  data: Array<{
    title: string;
    leftElement?: any;
    rightElement?: any;
    onPress(params): void;
    titleStyle?: object;
    bottomDivider?: boolean;
    testId?: string;
  }>;
}>;

const settingsList = (dependents: UserDependentBasicInfoType[], isCdhEnabled: boolean, userCountry: string, isTwicCardAllowed: boolean, updateAppCurrentStack: (stackName: string) => void, marketplaceEnabled: boolean, sso: {}): SettingsList => {
  const profile = {
    leftElement: <Image source={Images.user} style={iconStyle} />,
    rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
    title: "Profile",
    onPress: (params) => NavigationService.navigate(APP_ROUTES.USER_PROFILE_SETTINGS),
    bottomDivider: true,
    testId: "profile",
  };

  const twicCard = {
    leftElement: <Image source={Images.creditCard} style={iconStyle} />,
    rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
    title: "Forma Card",
    onPress: (params) => NavigationService.navigate(APP_ROUTES.USER_TWIC_CARD),
    bottomDivider: true,
    testId: "twic-card",
  };

  const benefitsCard = {
    leftElement: <Image source={Images.creditCard} style={iconStyle} />,
    rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
    title: "Benefits Cards",
    onPress: () => NavigationService.navigate(APP_ROUTES.PRETAX_CARD_SCREEN),
    bottomDivider: true,
    testId: "benefits-card",
  };

  const twicCardInfo = {
    title: "Forma Cards",
    id: "twicCards",
    showHeader: true,
  };

  const dependentsListConfig = !isEmptyOrNil(dependents)
    ? {
        title: "Dependents",
        id: "dependents",
        showHeader: true,
        data: map((dependent: UserDependentBasicInfoType) => {
          return {
            title: `${dependent.firstName} ${dependent.lastName}`,
            leftElement: <Image source={Images.user} style={iconStyle} />,
            rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
            onPress: () =>
              NavigationService.navigate(APP_ROUTES.UPDATE_DEPENDENTS_SCREEN, {
                dependentInfo: dependent,
              }),
            bottomDivider: true,
            testId: `${dependent.firstName} ${dependent.lastName}`,
          };
        })(dependents),
      }
    : {
        title: "",
        id: "dependents",
        showHeader: false,
        data: [],
      };

  const generateTwicCardsSection = () => {
    if (!isCdhEnabled && isTwicCardAllowed) {
      return {
        ...twicCardInfo,
        data: [{ ...twicCard }],
      };
    } else if (isCdhEnabled && !isTwicCardAllowed) {
      return {
        ...twicCardInfo,
        data: [{ ...benefitsCard }],
      };
    }
    return {
      ...twicCardInfo,
      data: [{ ...twicCard }, { ...benefitsCard }],
    };
  };

  const payments = {
    leftElement: <Image source={Images.bank} style={iconStyle} />,
    rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
    title: "Payments",
    onPress: () => NavigationService.navigate(APP_ROUTES.PAYMENTS_SCREEN),
    bottomDivider: true,
    testId: "payments",
  };

  const security = isEmptyOrNil(sso)
    ? [
        {
          leftElement: <LockSvgIcon fillColor={Colors.newDarkGrey} strokeWidth={"2.4"} width={27} height={27} style={{ marginLeft: -2, minWidth: 30 }} />,
          rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
          title: "Security",
          onPress: () => NavigationService.navigate(APP_ROUTES.SECURITY_SCREEN),
          bottomDivider: true,
          testId: "security",

          titleStyle: { marginLeft: -3 },
        },
      ]
    : [];

  const notifications = {
    leftElement: <Image source={Images.notifications} style={iconStyle} />,
    rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
    title: "Notifications",
    onPress: () => notificationsPermissions(),
    bottomDivider: true,
    testId: "notifications",
  };
  const logoutSection = [
    {
      leftElement: <ExternalLinkSvgIcon height={20} width={20} style={{ marginLeft: 3 }} />,
      title: "My Personal Data",
      titleStyle: { marginLeft: 2 },
      bottomDivider: true,
      onPress: () => openExternalLink(DELETE_ACCOUNT_URL),
    },
    {
      leftElement: <ChatSvgIcon height={20} width={20} style={{ marginLeft: 3 }} />,
      title: "Contact Support",
      titleStyle: { marginLeft: 2 },
      bottomDivider: true,
      onPress: () => displayIntercom(),
    },
    {
      leftElement: <Icon name="logout" size={21} color={Colors.charcoalDarkGrey} style={{ marginLeft: 2 }} />,
      title: "Log Out",
      titleStyle: { marginLeft: 3 },
      bottomDivider: true,
      onPress: () => AppAlert(LogoutAlertOptions(updateAppCurrentStack)),
    },
  ];

  const paymentSection = {
    title: "",
    showHeader: false,
    id: "payments",
    data: [{ ...profile }, { ...notifications }, { ...payments }, ...security, ...logoutSection],
  };

  // const integrationSection = {
  //   title: "Integrations",
  //   id: "integrations",
  //   showHeader: true,
  //   data: [
  //     {
  //       title: APP_CONSTANTS.IS_ANDROID ? "Google Fit" : "Apple Health",
  //       leftElement: <Icon name="hearto" size={21} color={Colors.charcoalDarkGrey} />,
  //       rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
  //       onPress: () => NavigationService.navigate(APP_ROUTES.USER_HEALTH),
  //       bottomDivider: true,
  //       testId: APP_CONSTANTS.IS_ANDROID ? "google-fit" : "apple-health",
  //     },
  //   ],
  // };
  const historySection = marketplaceEnabled
    ? [
        {
          title: "History",
          id: "history",
          showHeader: true,
          data: [
            {
              title: "Subscriptions",
              leftElement: (
                <Image
                  source={Images.subscripitons}
                  style={{
                    height: 22,
                    width: 22,
                  }}
                />
              ),
              rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
              onPress: () => NavigationService.navigate(APP_ROUTES.USER_SUBSCRIPTIONS),
              bottomDivider: true,
              testId: "subscriptions",
            },
            {
              title: "Orders",
              leftElement: <OrderSvgIcon height={19} width={19} fillColor={Colors.newCharcoalDarkGrey} style={{ ...iconStyle, marginLeft: 2 }} />,
              rightElement: <Image source={Images.arrowRight} style={iconStyle} />,
              onPress: () => NavigationService.navigate(APP_ROUTES.USER_ORDERS),
              bottomDivider: true,
              testId: "orders",
            },
          ],
        },
      ]
    : [];

  const InternationUserSettingSections = [{ ...paymentSection }, ...historySection, { ...dependentsListConfig }];

  const usUsersSettingAndCardsSections =
    !isCdhEnabled && !isTwicCardAllowed ? [{ ...paymentSection }, ...historySection, { ...dependentsListConfig }] : [{ ...paymentSection }, { ...generateTwicCardsSection() }, ...historySection, { ...dependentsListConfig }];

  return userCountry === "us" ? usUsersSettingAndCardsSections : InternationUserSettingSections;
};

export default settingsList;
