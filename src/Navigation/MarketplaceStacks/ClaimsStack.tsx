import * as React from "react";

import NewReimbursementScreen from "Screens/ReimbursementForm/NewReimbursementScreen";
import { AddDependentScreen } from "Screens/UserSettings";
import { Colors } from "Themes";
import { NewExpenseScreen } from "Screens/Expense";
import { ClaimsScreen } from "Screens/Claims/ClaimsScreen";

import { CommonMarketPlaceScreens, CommonTransactionScreens } from "./CommonScreens";
import { createStackNavigator } from "@react-navigation/stack";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";

const ClaimsStackScreens = {
  ClaimsScreen: {
    screen: ClaimsScreen,
    options: {
      headerShown: false,
    },
  },
  NewReimbursementScreen: {
    screen: NewReimbursementScreen,
  },
  NewExpenseScreen: {
    screen: NewExpenseScreen,
  },
  AddDependentScreen: {
    screen: AddDependentScreen,
    options: {
      headerTransparent: false,
    },
  },
};

const Stack = createStackNavigator();

const AllClaimsScreens = Object.entries({ ...ClaimsStackScreens, ...CommonMarketPlaceScreens, ...CommonTransactionScreens });

export const ClaimsScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ClaimsScreen"
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerLeft: () => <SimpleHeaderBackHandler />,
        headerStyle: {
          borderBottomWidth: 0,
          borderColor: Colors.transparent,
          elevation: 0,
          shadowColor: Colors.transparent,
        },
      }}
    >
      {AllClaimsScreens.map(([screenName, screenObj]) => {
        return <Stack.Screen component={screenObj.screen} name={screenName} options={screenObj["options"] ?? {}} />;
      })}
    </Stack.Navigator>
  );
};
