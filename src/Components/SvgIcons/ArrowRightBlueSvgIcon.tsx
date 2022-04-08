import * as React from "react";
import Svg, { Path } from "react-native-svg";

type ArrowRightBlueSvgIconType = {
  fillColor?: string;
};

const ArrowRightBlueSvgIcon = (props: ArrowRightBlueSvgIconType) => {
  const { fillColor } = props;
  return (
    <Svg width="15" height="14" viewBox="0 0 15 14">
      <Path
        fill="none"
        fill-rule="evenodd"
        stroke={fillColor}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.3"
        d="M8.27 1.632L13.94 7l-5.67 5.413M13.94 7H1.4"
      />
    </Svg>
  );
};

export default ArrowRightBlueSvgIcon;
