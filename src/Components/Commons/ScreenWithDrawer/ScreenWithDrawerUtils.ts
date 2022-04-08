import ExtraDimensions from "react-native-extra-dimensions-android";
import { Platform } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";

import { Metrics } from "../../../Themes";

const CONTENT_HEIGHT = Metrics.screenHeight - Metrics.navBarHeight;
export const getBottomSnapPoint = () => {
  let bottomSnapPoint = CONTENT_HEIGHT;

  // get height for the android soft menu and subtract it from the bottom snap point
  if (Platform.OS === "android") {
    const softMenuHeight = ExtraDimensions.getSoftMenuBarHeight();
    const offset = softMenuHeight > 0 ? softMenuHeight - 10 : Metrics.navBarHeight;
    bottomSnapPoint -= offset;
  } else {
    bottomSnapPoint -= 30;
  }
  return bottomSnapPoint;
};

export const getTopSnapPoint = () => {
  if (Platform.OS === "android") return Metrics.navBarHeight + 15;

  return isIphoneX() ? Metrics.navBarHeight + 50 : Metrics.navBarHeight;
};

export default {
  getBottomSnapPoint,
  getTopSnapPoint,
  CONTENT_HEIGHT,
};
