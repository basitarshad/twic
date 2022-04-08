import * as React from "react";
import Svg, { Path } from "react-native-svg";

type ArrowRightBlueSvgIconType = {
  fillColor?: string;
  width?: string;
  height?: string;
  strokeWidth?: number;
};

const ArrowTopRight = (props: ArrowRightBlueSvgIconType) => {
  const { fillColor, width = "14", height = "14", strokeWidth = 0.1 } = props;
  return (
    <Svg viewBox="0 0 14 14" fill="none" height={height} width={width}>
      <Path
        strokeWidth={strokeWidth}
        stroke={fillColor}
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.2664 1.17342C13.2634 1.17028 13.2604 1.16716 13.2574 1.16406C13.0613 0.965102 12.7861 0.895167 12.5345 0.954256L3.16926 0.964837C2.7416 0.96532 2.3953 1.31745 2.39578 1.75133C2.39626 2.18521 2.74333 2.53656 3.17098 2.53607L10.8185 2.52743L0.997063 12.4919C0.694663 12.7987 0.694664 13.2961 0.997063 13.6029C1.29946 13.9097 1.78975 13.9097 2.09215 13.6029L11.9456 3.60596L11.9051 11.3941C11.9028 11.828 12.2477 12.1815 12.6753 12.1838C13.103 12.1861 13.4515 11.8363 13.4537 11.4024L13.504 1.7438C13.5051 1.53458 13.4239 1.33355 13.2783 1.1853C13.2744 1.18129 13.2704 1.17733 13.2664 1.17342Z"
        fill="#236CEB"
      />
    </Svg>
  );
};

export default ArrowTopRight;
