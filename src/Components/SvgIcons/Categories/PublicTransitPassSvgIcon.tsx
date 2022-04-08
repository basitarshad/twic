import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PublicTransitPassSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.18 2.3a.72.72 0 01.72-.72h16.2a.72.72 0 01.72.72v1.32H2.18V2.3zM.62 4.4V2.3A2.28 2.28 0 012.9.02h16.2a2.28 2.28 0 012.28 2.28v11.4a2.28 2.28 0 01-2.28 2.28H2.9A2.28 2.28 0 01.62 13.7V4.4zm19.2.78v8.52a.72.72 0 01-.72.72H2.9a.72.72 0 01-.72-.72V5.18h17.64z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default PublicTransitPassSvgIcon;
