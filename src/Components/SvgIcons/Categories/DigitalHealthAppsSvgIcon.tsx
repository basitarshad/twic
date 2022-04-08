import * as React from "react";
import Svg, { Path } from "react-native-svg";

function DigitalHealthAppsSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.952 1.715a.877.877 0 01.548-.193h9c.199 0 .392.068.548.193l1.5 1.2c.208.166.33.418.33.685v1.522H20.1c.24 0 .47.099.635.273l2.7 2.836c.156.163.242.38.242.605V21.6a.878.878 0 01-.877.877H1.2a.878.878 0 01-.878-.877V8.836c0-.225.087-.442.242-.605l2.7-2.836a.878.878 0 01.636-.273h1.222V3.6c0-.267.121-.519.33-.685l1.5-1.2zm10.17 2.307v1.1H6.877v-1.1l.93-.745h8.385l.93.745zM4.276 6.877h15.448l2.198 2.31v11.536H2.077V9.187l2.199-2.31zM10.8 10.8a1.2 1.2 0 112.4 0v2.4h2.25a1.2 1.2 0 110 2.4H13.2V18a1.2 1.2 0 01-2.4 0v-2.4H8.4a1.2 1.2 0 010-2.4h2.4v-2.4z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default DigitalHealthAppsSvgIcon;
