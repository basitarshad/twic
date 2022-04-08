import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SvgComponent(props) {
  const { fillColor } = props;

  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Path
        fill={fillColor || "none"}
        stroke="#22222D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M1 1l13.45 13.702M14.45 1L1 14.702"
      />
    </Svg>
  );
}

export default SvgComponent;
