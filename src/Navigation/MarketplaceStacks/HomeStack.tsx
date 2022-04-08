import * as React from "react";
import { View } from "react-native";

import { HeaderBackHandler, HeaderCircularBackHandler, AppHeading } from "Components";
import { HomeScreen } from "Screens/Marketplace";
import { GymsMapViewScreen } from "Screens/GymsMapViewScreen";
import { CommonTransactionScreens, CommonMarketPlaceScreens } from "./CommonScreens";

import { Colors, Fonts, Metrics } from "Themes";
import NewReimbursementScreen from "Screens/ReimbursementForm/NewReimbursementScreen";
import { APP_CONSTANTS } from "Constants";
import { NewExpenseScreen } from "Screens/Expense";
import HomeScreenWalletListingScreen from "Screens/Marketplace/HomeScreenWalletListingScreen";
import HomeScreenPreTaxStoresListingScreen from "Screens/Marketplace/HomeScreenPreTaxStoresListingScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { ReplacePhysicalTwicCardScreen, TwicCardsConfirmation, TwicCardsScreen } from "Screens/TwicCards";
import CreateTwicCard from "Screens/TwicCards/CreateTwicCard";
import { UpdateAddressForm } from "Screens/TwicCards/Components/UpdateAddressForm";
import SubscriptionCancellationScreen from "Screens/UserSettings/UserSubscriptionDetailScreen/SubscriptionCancellationScreen";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";

const HomeStackScreens = {
  HomeScreen: {
    screen: HomeScreen,
    options: {
      headerShown: false,
      animationEnabled: false,
    },
  },
  HomeScreenWalletListingScreen: {
    screen: HomeScreenWalletListingScreen,
    options: {
      headerShown: false,
      animationEnabled: false,
    },
  },
  HomeScreenPreTaxStoresListingScreen: {
    screen: HomeScreenPreTaxStoresListingScreen,
    options: {
      headerShown: false,
      animationEnabled: false,
    },
  },
  NewReimbursementScreen: {
    screen: NewReimbursementScreen,
  },
  NewExpenseScreen: {
    screen: NewExpenseScreen,
  },
  GymsMapViewScreen: {
    screen: GymsMapViewScreen,
    options: {
      headerShown: false,
    },
  },
  TwicCardsScreen: {
    screen: TwicCardsScreen,
    navigationOptions: {
      //
      headerTransparent: false,
    },
  },
  TwicCardsConfirmation: {
    screen: TwicCardsConfirmation,
    navigationOptions: {
      headerShown: false,
    },
    options: {
      headerShown: false,
    },
  },
  CreateTwicCard: {
    screen: CreateTwicCard,
    navigationOptions: {
      headerShown: false,
    },
    options: {
      headerShown: false,
    },
  },
  UpdateAddressForm: {
    screen: UpdateAddressForm,
    navigationOptions: {
      headerTransparent: false,
    },
  },
  ReplacePhysicalTwicCardScreen: {
    screen: ReplacePhysicalTwicCardScreen,
    navigationOptions: {
      headerTransparent: false,
    },
  },
  SubscriptionCancellationScreen: {
    screen: SubscriptionCancellationScreen,
  },
};

const Stack = createStackNavigator();

const AllHomeScreens = Object.entries({ ...HomeStackScreens, ...CommonMarketPlaceScreens, ...CommonTransactionScreens });
export const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerLeft: () => <SimpleHeaderBackHandler />,
        headerStyle: { borderBottomWidth: 0, borderColor: Colors.transparent, elevation: 0, shadowColor: Colors.transparent },
      }}
    >
      {AllHomeScreens.map(([screenName, screenObj]) => {
        return <Stack.Screen component={screenObj.screen} name={screenName} key={screenName} options={screenObj["options"] ?? {}} />;
      })}
    </Stack.Navigator>
  );
};
