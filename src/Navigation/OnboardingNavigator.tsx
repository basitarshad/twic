import * as React from "react";
import SplashScreen from "react-native-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";

import { ProfileConfirmationScreen, NotificationsScreen } from "Screens/Onboarding";
import OnboardingScreen from "Screens/Onboarding/OnboardingScreen";
import PosttaxListingScreen from "Screens/Onboarding/PosttaxListingScreen";
import PretaxListingScreen from "Screens/Onboarding/PretaxListingScreen";
import BenefitsScreen from "Screens/Onboarding/BenefitsScreen";
import CompleteProfileScreen from "Screens/Onboarding/CompleteProfile/CompleteProfileScreen";

import { Colors } from "../Themes";
import WebViewScreen from "Screens/WebViewScreen";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";

const OnboardingStackScreens = {
  OnboardingScreen: {
    screen: OnboardingScreen,
    options: {
      headerShown: false,
    },
  },
  ProfileConfirmationScreen: {
    screen: ProfileConfirmationScreen,
    options: {
      headerShown: false,
    },
  },
  NotificationsScreen: {
    screen: NotificationsScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  PosttaxListingScreen: {
    screen: PosttaxListingScreen,
    options: {
      headerShown: false,
    },
  },
  PretaxListingScreen: {
    screen: PretaxListingScreen,
    options: {
      headerShown: false,
    },
  },
  Benefits: {
    screen: BenefitsScreen,
    options: {
      headerShown: false,
    },
  },
  CompleteProfileScreen: {
    screen: CompleteProfileScreen,
    options: {
      headerLeft: () => null,
      headerTransparent: false,
      gestureEnabled: false,
    },
  },
  WebViewScreen: {
    screen: WebViewScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
};
const Stack = createStackNavigator();

const AllOnboardingScreens = Object.entries({ ...OnboardingStackScreens });

export const OnboardingNavigatorStack = (props) => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <Stack.Navigator
        initialRouteName="OnboardingScreen"
        screenOptions={{
          headerStyle: {
            borderColor: Colors.transparent,
            elevation: 0,
            shadowColor: Colors.transparent,
            borderBottomWidth: 0,
          },
          headerTransparent: true,
          headerTitle: "",
          headerShown: true,
        }}
      >
        {AllOnboardingScreens.map(([screenName, screenObj]) => {
          return <Stack.Screen component={screenObj.screen} name={screenName} key={screenName} options={screenObj["options"] ?? {}} />;
        })}
      </Stack.Navigator>
    </SafeAreaView>
  );
};
