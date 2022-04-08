import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { Colors } from "../../Themes";

const LockSvgIcon = (props) => {
  const { fillColor = Colors.white, strokeWidth = "1.3", ...prop } = props;

  return (
    <Svg width="48" height="48" viewBox="0 0 48 48" {...prop}>
      <G fill="none" fill-rule="evenodd">
        <G stroke={fillColor} stroke-width={strokeWidth} strokeWidth={strokeWidth}>
          <G>
            <G>
              <Path
                d="M15 18h18c1.657 0 3 1.343 3 3v16c0 1.657-1.343 3-3 3H15c-1.657 0-3-1.343-3-3V21c0-1.657 1.343-3 3-3zm9 6c1.933 0 3.5 1.567 3.5 3.5 0 1.189-.593 2.24-1.5 2.872V33.5c0 .552-.448 1-1 1h-2c-.552 0-1-.448-1-1v-3.127c-.907-.633-1.5-1.684-1.5-2.873 0-1.933 1.567-3.5 3.5-3.5zm3-18c1.657 0 3 1.343 3 3v9H18V9c0-1.657 1.343-3 3-3h6z"
                transform="translate(-609 -360) translate(474 282) translate(135 78)"
              />
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default LockSvgIcon;
