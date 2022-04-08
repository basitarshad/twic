import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "Themes";
import { SvgIconType } from "../../types";

const ArrowRightSvgIcon = (props: SvgIconType) => {
  const { fillColor = Colors.newBlue } = props;

  return (
    <Svg width={21} height={20} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 3.667a.78.78 0 111.053-1.15l9.69 8.87a.778.778 0 01.255.577v.012a.778.778 0 01-.253.563l-9.69 8.945a.78.78 0 01-1.058-1.146l8.226-7.594H1.283a.78.78 0 11-.001-1.56h19.429L12.5 3.667z"
        fill={fillColor}
      />
    </Svg>
  );
};

export default ArrowRightSvgIcon;
