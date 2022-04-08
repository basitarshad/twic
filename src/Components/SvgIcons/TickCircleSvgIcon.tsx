import * as React from "react";
import Svg, { G, Path, Circle } from "react-native-svg";
import { Colors } from "../../Themes";

const TickCircleSvgIcon = (props) => {
  const { fillColor = Colors.charcoalDarkGrey, strokeWidth = 1.8 } = props;

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={fillColor}
        strokeWidth={strokeWidth}
        d="M12 23.25c6.213 0 11.25-5.037 11.25-11.25S18.213.75 12 .75.75 5.787.75 12 5.787 23.25 12 23.25zM6.532 11.923l3.377 3.43 6.82-6.52"
      />
    </Svg>
  );
};

export default TickCircleSvgIcon;
