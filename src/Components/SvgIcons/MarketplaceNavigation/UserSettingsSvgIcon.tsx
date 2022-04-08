import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { SvgIconType } from "../../../types";

const UserSettingsSvgIcon = (props: SvgIconType) => {
  const { fillColor = "#70747D" } = props;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M16.017 5.374c.626 0 1.239.054 1.835.157l1.28 4.06 3.97-1.53a10.726 10.726 0 012.29 2.867l-2.376 3.532 3.671 2.15a10.616 10.616 0 01-.814 3.579l-4.243.345.607 4.212a10.65 10.65 0 01-3.305 1.593l-2.915-3.103-2.916 3.103c-1.2-.34-2.315-.884-3.304-1.593l.608-4.212-4.244-.345a10.64 10.64 0 01-.814-3.578l3.672-2.15-2.376-3.533a10.722 10.722 0 012.29-2.867l3.97 1.53 1.28-4.06a10.765 10.765 0 011.834-.157zm.012 7.585a3.064 3.064 0 100 6.129 3.064 3.064 0 000-6.129z"
      />
    </Svg>
  );
};

export default UserSettingsSvgIcon;
