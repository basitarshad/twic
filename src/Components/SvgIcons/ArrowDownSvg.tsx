import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

import Colors from "Themes/Colors";

export const ArrowDownSvg = (props) => {
  const { fillColor = Colors.blue } = props;

  return (
    <Svg width="15" height="16" viewBox="0 0 15 16" fill="none">
      <Path d="M12.0605 7.62293L6.69214 13.2924M6.69214 13.2924L1.27881 7.62293M6.69214 13.2924L6.69214 0.752514" stroke={fillColor} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
  );
};
