import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SmartDevicesSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.18 2.4a.42.42 0 01.42-.42h4.8a.42.42 0 01.42.42v2.82H9.18V2.4zM7.62 5.22V2.4A1.98 1.98 0 019.6.42h4.8a1.98 1.98 0 011.98 1.98v2.82h.42a3.18 3.18 0 013.18 3.18v7.2a3.18 3.18 0 01-3.18 3.18h-.42v2.82a1.98 1.98 0 01-1.98 1.98H9.6a1.98 1.98 0 01-1.98-1.98v-2.82H7.2a3.18 3.18 0 01-3.18-3.18V8.4A3.18 3.18 0 017.2 5.22h.42zM9.18 21.6v-2.82h5.64v2.82a.42.42 0 01-.42.42H9.6a.42.42 0 01-.42-.42zm7.62-4.38H7.2a1.62 1.62 0 01-1.62-1.62V8.4c0-.895.725-1.62 1.62-1.62h9.6c.894 0 1.62.725 1.62 1.62v7.2a1.62 1.62 0 01-1.62 1.62zM12.78 8.4a.78.78 0 10-1.56 0v4.2a.78.78 0 001.026.74l3.6-1.2a.78.78 0 00-.493-1.48l-2.573.858V8.4z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default SmartDevicesSvgIcon;
