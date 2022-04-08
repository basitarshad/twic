import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "Themes";

function CalendarSvgIcon(props) {
  const { color = Colors.black } = props;
  return (
    <Svg width={14} height={15} viewBox="0 0 14 15" {...props}>
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M11.5 3.5A1.5 1.5 0 0113 5v7.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 011 12.5V5a1.5 1.5 0 011.5-1.5h9zM4.75 1.25v6m4.5-6v6m-8.262 3H13m-8.25.047V14m4.5-3.703V14"
      />
    </Svg>
  );
}

export default CalendarSvgIcon;
