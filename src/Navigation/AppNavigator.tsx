// import { createAppContainer, createSwitchNavigator } from "react-navigation";
import * as React from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
// src
import AuthNavigator from "./AuthNavigator";
import AuthLoadingScreen from "../Screens/AuthLoadingScreen";
import { OnboardingNavigatorStack } from "./OnboardingNavigator";

import MarketplaceNavigator from "./MarketplaceNavigator";

const renderCurrentStack = (stackName) => {
  switch (stackName) {
    case "Auth":
      return AuthNavigator;
    case "App":
      return MarketplaceNavigator;
    case "Onboarding":
      return OnboardingNavigatorStack;
    case "AuthLoading":
    default:
      return AuthLoadingScreen;
  }
};
export const AppNavigator = () => {
  const currentStack = useSelector((state) => pathOr("AuthLoading", ["appCurrentStack", "currentStack"], state));
  const CurrentStackComp = renderCurrentStack(currentStack);
  return <CurrentStackComp />;
};
