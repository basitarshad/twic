import * as React from "react";

import {
  UserProfileScreen,
  // UserHealthScreen,
  UserBankAccountScreen,
  TwicCardFaqScreen,
  UserNotificationsSettingsScreen,
  NotificationPermissionScreen,
  UserProfileSettingsScreen,
  PretaxCardScreen,
  UpdateDependentsScreen,
  RequestPreTaxCardScreen,
  RequestPreTaxCardWithNewDependent,
  RequestPreTaxCardWithExistingDependent,
  RequestPreTaxCardSubmissionScreen,
  PretaxCardScreenWithDependentCard,
  ManualBankLinkScreen,
  ManualBankLinkVerificationScreen,
  SecurityScreen,
} from "Screens/UserSettings";
import { Colors } from "Themes";
import WebViewScreen from "Screens/WebViewScreen";
import BankConnectWebViewScreen from "Screens/BankConnectWebViewScreen";
import { NavigationService } from "Services";
import { PaymentsScreen } from "Screens/Payments";
import { CommonSettingsScreen } from "./CommonScreens";
import UserOrdersScreen from "Screens/UserSettings/UserOrders/UserOrdersScreen";
import UserSubscriptionsScreen from "Screens/UserSettings/UserSubscriptions/UserSubscriptionsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";

const UserSettingsStackScreen = {
  UserProfileScreen: {
    screen: UserProfileScreen,
    options: {
      headerShown: false,
    },
  },
  UserProfileSettingsScreen: {
    screen: UserProfileSettingsScreen,
  },
  SecurityScreen: {
    screen: SecurityScreen,
  },

  PretaxCardScreen: {
    screen: PretaxCardScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler backHandler={() => NavigationService.goBackToFirstScreenOfStack()} />,
    },
  },
  RequestPreTaxCardScreen: {
    screen: RequestPreTaxCardScreen,
  },
  RequestPreTaxCardWithNewDependent: {
    screen: RequestPreTaxCardWithNewDependent,
  },
  RequestPreTaxCardWithExistingDependent: {
    screen: RequestPreTaxCardWithExistingDependent,
  },
  RequestPreTaxCardSubmissionScreen: {
    screen: RequestPreTaxCardSubmissionScreen,
    options: {
      headerShown: false,
    },
  },
  UpdateDependentsScreen: {
    screen: UpdateDependentsScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler backHandler={() => NavigationService.goBackToFirstScreenOfStack()} />,
    },
  },
  PretaxCardScreenWithDependentCard: {
    screen: PretaxCardScreenWithDependentCard,
  },
  // UserHealthScreen: {
  //   screen: UserHealthScreen,
  // },
  UserOrdersScreen: {
    screen: UserOrdersScreen,
  },
  UserSubscriptionsScreen: {
    screen: UserSubscriptionsScreen,
  },
  UserBankAccountScreen: {
    screen: UserBankAccountScreen,
  },
  ManualBankLinkScreen: {
    screen: ManualBankLinkScreen,
  },
  ManualBankLinkVerificationScreen: {
    screen: ManualBankLinkVerificationScreen,
  },
  TwicCardFaqScreen: {
    screen: TwicCardFaqScreen,
  },
  UserNotificationsSettingsScreen: {
    screen: UserNotificationsSettingsScreen,
  },
  WebViewScreen: {
    screen: WebViewScreen,
    options: {
      headerTransparent: false,
    },
  },

  BankConnectWebViewScreen: {
    screen: BankConnectWebViewScreen,
  },
  PaymentsScreen: {
    screen: PaymentsScreen,
  },
  NotificationPermissionScreen: {
    screen: NotificationPermissionScreen,
  },
};

const Stack = createStackNavigator();
const AllUserSettingsScreens = Object.entries({ ...UserSettingsStackScreen, ...CommonSettingsScreen });

export const UserSettingsScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfileScreen"
      screenOptions={{
        headerLeft: () => <SimpleHeaderBackHandler />,
        headerStyle: {
          borderBottomWidth: 0,
          borderColor: Colors.transparent,
          elevation: 0,
          shadowColor: Colors.transparent,
        },
        headerTitle: "",
        headerShown: true,
      }}
    >
      {AllUserSettingsScreens.map(([screenName, screenObj]) => {
        return <Stack.Screen component={screenObj.screen} name={screenName} options={screenObj["options"] ?? {}} />;
      })}
    </Stack.Navigator>
  );
};
