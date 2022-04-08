import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CopyToClipboardSvgIcon = (props) => {
  const { fillColor = "#22222D", strokeWidth = 1.3 } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M18.5 7A1.5 1.5 0 0120 8.5v10a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 018 18.5V17h6.5a1.5 1.5 0 001.493-1.356L16 15.5V7h2.5zm-13-3h9A1.5 1.5 0 0116 5.5v10a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 15.5v-10A1.5 1.5 0 015.5 4z"
      />
    </Svg>
  );
};

export default CopyToClipboardSvgIcon;
