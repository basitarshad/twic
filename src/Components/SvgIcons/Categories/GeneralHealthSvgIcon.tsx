import * as React from "react";
import Svg, { Path } from "react-native-svg";

function GeneralHealthSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        clipRule="evenodd"
        d="M12.016 21.6s-5.528-4.81-9.477-8.818c-1.58-1.603-2.256-5.543.79-8.016 3.948-3.207 8.687 2.404 8.687 2.404s4.738-5.61 8.687-2.404c2.956 2.4 2.369 6.413.79 8.016-3.932 3.99-9.477 8.818-9.477 8.818z"
        stroke={fillColor}
        strokeWidth={1.56}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default GeneralHealthSvgIcon;
