import React from "react";
import { StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "Themes";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { APP_CONSTANTS } from "Constants";

type ThemeType = "default" | "light" | "loading" | "drawer" | "upload" | "welcome";

export const toggleStatusBarTheme = (type: ThemeType) => {
  const { App, Drawer, Light, Loading, Upload, Welcome } = Colors.statusBar;
  const getBgColor = () => {
    switch (type) {
      case "default":
        return App;
      case "light":
        return Light;
      case "loading":
        return Loading;
      case "upload":
        return Upload;
      case "drawer":
        return Drawer;
      case "welcome":
        return Welcome;
      default:
        return Light;
    }
  };
  const bgColor = getBgColor();
  const bar = type === "welcome" ? "light-content" : "dark-content";
  StatusBar.setBarStyle(bar);
  if (APP_CONSTANTS.IS_ANDROID) StatusBar.setBackgroundColor(bgColor);
};

export const useStatusBarTheme = () => {
  const isFocused = useIsFocused();
  const screenLoader = useSelector((state) => pathOr(false, ["appScreenLoader", "isLoading"], state));
  React.useEffect(() => {
    if (isFocused) {
      toggleStatusBarTheme("default");
    } else {
      if (!screenLoader) toggleStatusBarTheme("light");
    }
  }, [isFocused]);
};
