import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { SvgIconType } from "../../../types";

const AccountsSvgIcon = (props) => {
  const { fillColor = "#70747D" } = props;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        clipRule="evenodd"
        d="M25.667 8.549c.92 0 1.666.746 1.666 1.667v13.333c0 .92-.746 1.666-1.666 1.666h-20C4.747 25.215 4 24.47 4 23.55V10.216c0-.921.746-1.667 1.667-1.667h20zM25.658 5.892a.672.672 0 01.009.108v2.548H5.65a.638.638 0 01.242-.091l19-3.115a.667.667 0 01.766.55z"
        stroke={fillColor}
        strokeWidth={1.8}
      />
      <Path strokeWidth={1.8} stroke={fillColor} d="M26.5 12.824h-2.333a.833.833 0 00-.833.834v6.333c0 .46.373.833.833.833h2.334c.46 0 .833-.373.833-.833v-6.333a.833.833 0 00-.833-.834z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default AccountsSvgIcon;
