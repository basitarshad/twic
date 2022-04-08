import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../Themes";

export const CardLockSvgIcon = (props) => {
  const { fillColor = Colors.white, strokeWidth = "1.3", ...prop } = props;

  return (
    <Svg
      width={21}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2 2.58A1.02 1.02 0 009.18 3.6v4.62h5.64V3.6a1.02 1.02 0 00-1.02-1.02h-3.6zM7.62 3.6v4.62H6.6a2.58 2.58 0 00-2.58 2.58v9.6a2.58 2.58 0 002.58 2.58h10.8a2.58 2.58 0 002.58-2.58v-9.6a2.58 2.58 0 00-2.58-2.58h-1.02V3.6a2.58 2.58 0 00-2.58-2.58h-3.6A2.58 2.58 0 007.62 3.6zM6.6 9.78h10.8c.563 0 1.02.457 1.02 1.02v9.6a1.02 1.02 0 01-1.02 1.02H6.6a1.02 1.02 0 01-1.02-1.02v-9.6c0-.563.457-1.02 1.02-1.02zm7.5 4.92c0 .715-.357 1.346-.902 1.725l.002.075v1.2a1.2 1.2 0 11-2.4 0v-1.2c0-.025 0-.05.002-.075A2.1 2.1 0 1114.1 14.7z"
        fill={fillColor}
      />
    </Svg>
  );
};
