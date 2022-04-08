import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../Themes";

const UnlockSvgIcon = (props) => {
  const { fillColor = Colors.white } = props;

  return (
    <Svg
      width={21}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2.4 8.4V3a1.8 1.8 0 011.8-1.8h3.6A1.8 1.8 0 019.6 3v5.4m-1.8 0h10.8a1.8 1.8 0 011.8 1.8v9.6a1.8 1.8 0 01-1.8 1.8H7.8A1.8 1.8 0 016 19.8v-9.6a1.8 1.8 0 011.8-1.8zm5.4 3.6a2.1 2.1 0 011.197 3.826.736.736 0 01.003.074v1.2a1.2 1.2 0 11-2.4 0v-1.2l.003-.074A2.1 2.1 0 0113.2 12z"
        stroke={fillColor}
        strokeWidth={1.56}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default UnlockSvgIcon;
