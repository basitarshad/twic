import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { useAccountsHook } from "Screens/Marketplace/useAccountsHook";

import { AppNavigatorTabs } from "./AppNavigatorTabs";
import { AccountsScreenStack } from "./MarketplaceStacks/AccountsStack";
import { ClaimsScreenStack } from "./MarketplaceStacks/ClaimsStack";
import { HomeScreenStack } from "./MarketplaceStacks/HomeStack";
import { UserSettingsScreenStack } from "./MarketplaceStacks/UserSettingsStack";
import { isFSAStore } from "Utils";

const Tab = createBottomTabNavigator();

// const getInitialRouteName = (stack)
export const BottomTabNavigator = () => {
  const { isReimbursementEnabled, showMarketplace, isFSAStoreEnabled } = useAccountsHook();

  const showHomeStack = showMarketplace || isFSAStoreEnabled;
  const initialRouteName = showHomeStack ? "HomeScreen" : isReimbursementEnabled ? "ClaimsScreen" : "AccountsScreen";

  return (
    <Tab.Navigator initialRouteName={initialRouteName} tabBar={(params) => <AppNavigatorTabs {...params} />} screenOptions={{ headerShown: false }}>
      {showHomeStack && <Tab.Screen name="HomeScreen" component={HomeScreenStack} />}
      <Tab.Screen name="AccountsScreen" component={AccountsScreenStack} />
      {isReimbursementEnabled && <Tab.Screen name="ClaimsScreen" component={ClaimsScreenStack} />}
      <Tab.Screen name="UserSettingsScreen" component={UserSettingsScreenStack} />
    </Tab.Navigator>
  );
};
