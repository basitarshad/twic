import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";

export const CheckedCheckBox = (props) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="5.33333" fill="#236CEB" />
      <Path d="M5.33334 10.6472L9.66129 16L18.4 6.66666" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
  );
};
