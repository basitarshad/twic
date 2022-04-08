import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../Themes";

export const CancelSvgIcon = (props) => {
  const { fillColor = Colors.white, strokeWidth = 1.3, ...prop } = props;

  return (
    <Svg width={20} height={19} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.036 3.947A9.975 9.975 0 0112 1.98c5.534 0 10.02 4.486 10.02 10.02 0 2.741-1.1 5.225-2.884 7.035L6.036 3.947zM4.859 4.971A9.988 9.988 0 001.98 12c0 5.534 4.486 10.02 10.02 10.02 2.231 0 4.292-.73 5.958-1.963L4.858 4.971zM12 .42C5.605.42.42 5.605.42 12c0 6.395 5.185 11.58 11.58 11.58 6.395 0 11.58-5.185 11.58-11.58C23.58 5.605 18.395.42 12 .42z"
        fill={fillColor}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
};
