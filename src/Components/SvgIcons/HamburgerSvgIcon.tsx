import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../Themes";

type HamburgerSvgIconProps = {
  fillColor?: string;
  height?: number;
  width?: number;
};

const HamburgerSvgIcon = (props: HamburgerSvgIconProps) => {
  const { fillColor = Colors.primary, height = 13, width = 16 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 16 13" {...props}>
      <Path fill={fillColor || "none"} stroke="#3C3D47" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M1.333 1.583H14.68m-13.347 5H14.68m-13.347 5H14.68" />
    </Svg>
  );
};

export default HamburgerSvgIcon;
