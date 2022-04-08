import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Colors } from "Themes";
import { HeaderBackHandler, HeaderCircularBackHandler } from "Components";
import NewReimbursementScreen from "Screens/ReimbursementForm/NewReimbursementScreen";
import { AddDependentScreen } from "Screens/UserSettings";
import WebViewScreen from "Screens/WebViewScreen";
import { NewExpenseScreen } from "Screens/Expense";
import ExpenseSubmissionScreen from "Screens/Expense/ExpenseSubmissionScreen";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import PreTaxAccountDetailScreen from "Screens/Accounts/PreTaxAccountDetailScreen/PreTaxAccountDetailScreen";
import PostTaxAllActivities from "Screens/Accounts/PostTaxAccountDetailScreen/PostTaxAllActivities";
import PostTaxAccountDetailScreen from "Screens/Accounts/PostTaxAccountDetailScreen/PostTaxAccountDetailScreen";
import PreTaxAllActivities from "Screens/Accounts/PreTaxAccountDetailScreen/PreTaxAllActivities";
import AccountsScreen from "Screens/Accounts/AccountsScreen";
import { CommonSettingsScreen, CommonTransactionScreens } from "./CommonScreens";

const AccountsStackScreens = {
  AccountsScreen: {
    screen: AccountsScreen,
    options: {
      headerShown: false,
    },
  },
  PreTaxAccountDetailScreen: {
    screen: PreTaxAccountDetailScreen,
  },
  PostTaxAllActivities: {
    screen: PostTaxAllActivities,
  },
  PreTaxAllActivities: {
    screen: PreTaxAllActivities,
  },
  PostTaxAccountDetailScreen: {
    screen: PostTaxAccountDetailScreen,
  },
  NewReimbursementScreen: {
    screen: NewReimbursementScreen,
  },
  NewExpenseScreen: {
    screen: NewExpenseScreen,
  },
  ExpenseSubmissionScreen: {
    screen: ExpenseSubmissionScreen,
    options: {
      headerShown: false,
    },
  },
  AddDependentScreen: {
    screen: AddDependentScreen,
    options: {
      headerTransparent: false,
    },
  },
  WebViewScreen: {
    screen: WebViewScreen,
    options: {
      headerTransparent: false,
    },
  },
};

const Stack = createStackNavigator();
const AllAccountsScreens = Object.entries({ ...AccountsStackScreens, ...CommonSettingsScreen, ...CommonTransactionScreens });

export const AccountsScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountsScreen"
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
      {AllAccountsScreens.map(([screenName, screenObj]) => {
        return <Stack.Screen component={screenObj.screen} name={screenName} options={screenObj["options"] ?? {}} />;
      })}
    </Stack.Navigator>
  );
};
