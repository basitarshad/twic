import * as React from "react";
import Svg, { G, Path, Defs, Rect, ClipPath } from "react-native-svg";

import Colors from "Themes/Colors";

export const WhiteInfoIconSvg = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
      <G clipPath="url(#prefix__clip0_2788:57394)" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M8 14.667A6.667 6.667 0 108 1.334a6.667 6.667 0 000 13.333zM8 10.667V8M8 5.333h.007" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_2788:57394">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
