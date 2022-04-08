import * as React from "react";
import ProgressLoader from "rn-progress-loader";
import { connect } from "react-redux";
import { If } from "react-if";

import { Colors } from "Themes";
import { toggleStatusBarTheme } from "../../Hooks";

type AppLoaderProps = {
  hudColor?: string;
  color?: string;
  isHUD?: boolean;
  isModal?: boolean;
  isLoading?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  keepDarkTheme?: boolean;
};
const AppScreenLoader = (props: AppLoaderProps) => {
  const { isLoading = false, hudColor = Colors.black, color = Colors.white, isHUD = true, isModal = true, testID = "app-screen-loader", accessibilityLabel = "app-screen-loader", keepDarkTheme = false } = props;

  React.useEffect(() => {
    if (isLoading) {
      toggleStatusBarTheme("loading");
    } else {
      toggleStatusBarTheme(keepDarkTheme ? "default" : "light");
    }
  }, [isLoading]);

  return isLoading ? <ProgressLoader visible={isLoading} isModal={isModal} isHUD={isHUD} hudColor={hudColor} testID={testID} accessibilityLabel={accessibilityLabel} color={color} /> : null;
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.appScreenLoader.isLoading,
    keepDarkTheme: state.appScreenLoader.keepDarkTheme,
  };
};

export default connect(mapStateToProps)(AppScreenLoader);
