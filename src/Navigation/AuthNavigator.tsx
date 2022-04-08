import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "react-native-splash-screen";

import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import { LoginScreen, PasswordScreen, LoginWithSsoScreen, AuthSelectionScreen, ResetPasswordScreen } from "../Screens/Login";
import { Colors } from "../Themes";
import { LoginContextProvider } from "../Screens/Login/loginContext";
import WebViewScreen from "../Screens/WebViewScreen";
import NavigationTransitions from "./NavigationTransitions";
import { LoginWithMagicLinkScreen } from "Screens/Login/LoginWithMagicLinkScreen";
import { AppAccessErrorScreen } from "Screens/Login/AppAccessErrorScreen";

const AuthStackScreens = {
  AuthSelectionScreen: {
    screen: AuthSelectionScreen,
    options: {
      headerShown: false,
    },
  },
  ResetPasswordScreen: {
    screen: ResetPasswordScreen,
    options: {
      headerShown: false,
    },
  },
  LoginScreen: {
    screen: LoginScreen,
    options: {
      headerTransparent: true,
    },
  },
  AppAccessErrorScreen: {
    screen: AppAccessErrorScreen,
  },
  PasswordScreen: {
    screen: PasswordScreen,
    options: {
      headerTransparent: true,
    },
  },
  LoginWithSsoScreen: {
    screen: LoginWithSsoScreen,
    options: {
      headerTransparent: false,
    },
  },
  LoginWithMagicLinkScreen: {
    screen: LoginWithMagicLinkScreen,
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

const StackNavigatorConfig = {
  defaultNavigationOptions: {
    headerStyle: {
      borderBottomWidth: 0,
      borderColor: Colors.transparent,
    },
    headerTransparent: true,
    headerTitle: "",
    headerShown: true,
  },
  navigationOptions: NavigationTransitions,
};

// const AuthNavigator = createStackNavigator(navigationScreens, StackNavigatorConfig);

const Stack = createStackNavigator();

const AllAuthScreens = Object.entries({ ...AuthStackScreens });

const AuthNavigatorWithProvider = (props) => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <LoginContextProvider>
      <Stack.Navigator
        initialRouteName="AuthSelectionScreen"
        screenOptions={{
          headerStyle: {
            borderBottomWidth: 0,
            borderColor: Colors.transparent,
          },
          headerLeft: () => <SimpleHeaderBackHandler />,
          headerTransparent: true,
          headerTitle: "",
          headerShown: true,
        }}
      >
        {AllAuthScreens.map(([screenName, screenObj]) => {
          return <Stack.Screen component={screenObj.screen} name={screenName} key={screenName} options={screenObj["options"] ?? {}} />;
        })}
      </Stack.Navigator>
    </LoginContextProvider>
  );
};
// AuthNavigatorWithProvider.router = AuthNavigator.router;

export default AuthNavigatorWithProvider;
