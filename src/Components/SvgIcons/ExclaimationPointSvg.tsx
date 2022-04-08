import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

import Colors from "Themes/Colors";

export const ExclaimationPointSvg = (props) => {
  const { fillColor = "#E27815" } = props;

  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Circle cx="9.64" cy="9.64" r="8.64" stroke={fillColor} strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.39125 4.51741C8.1578 4.62635 8.02081 4.87299 8.05168 5.12876L8.68015 10.3351C8.73594 10.7973 9.12818 11.145 9.59376 11.145C10.071 11.145 10.469 10.7802 10.5105 10.3048L10.9634 5.11841C10.9853 4.86719 10.8451 4.62779 10.6166 4.52115C9.91387 4.19321 9.09399 4.18947 8.39125 4.51741ZM10.377 14.1721C10.1664 14.3827 9.9207 14.488 9.6399 14.488C9.3591 14.488 9.1134 14.3827 8.9028 14.1721C8.6922 13.9615 8.5869 13.7158 8.5869 13.435C8.5869 13.1542 8.6922 12.9085 8.9028 12.6979C9.1134 12.4873 9.3591 12.382 9.6399 12.382C9.9207 12.382 10.1664 12.4873 10.377 12.6979C10.5876 12.9085 10.6929 13.1542 10.6929 13.435C10.6929 13.7158 10.5876 13.9615 10.377 14.1721Z"
        fill="#E27815"
      />
    </Svg>
  );
};
