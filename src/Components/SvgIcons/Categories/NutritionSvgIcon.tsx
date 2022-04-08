import * as React from "react";
import Svg, { Path } from "react-native-svg";

function NutritionSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M11.648 22.8V11.102m0 1.2s7.345.404 9.595-1.9C23.492 8.1 22.49 1.2 22.49 1.2s-7.18 0-9.248 2.972c-1.627 2.34-1.595 8.13-1.595 8.13zm0 4.87s-.911-3.449-3.163-5.459-7.286-.587-7.286-.587.386 4.445 2.622 6.44c2.237 1.997 7.827-.393 7.827-.393z"
        stroke={fillColor}
        strokeWidth={1.56}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default NutritionSvgIcon;
