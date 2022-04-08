import * as React from "react";
import Svg, { Path } from "react-native-svg";

import Colors from "Themes/Colors";

export const ArrowUpSvg = (props) => {
  const { fillColor = Colors.blue, height = 14, width = 13 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 13 14" fill="none">
      <Path d="M1.27881 6.422L6.64722 0.752563M6.64722 0.752563L12.0605 6.422M6.64722 0.752563L6.64722 13.2924" stroke={fillColor} stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
  );
};
