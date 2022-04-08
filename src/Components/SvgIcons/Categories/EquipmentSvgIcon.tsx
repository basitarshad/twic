import * as React from "react";
import Svg, { Path } from "react-native-svg";

function EquipmentSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.18a1.908 1.908 0 00-1.918 1.898c0 1.043.854 1.898 1.919 1.898a1.908 1.908 0 001.918-1.898 1.908 1.908 0 00-1.918-1.898zM8.523 5.078c0-1.915 1.563-3.458 3.479-3.458 1.915 0 3.479 1.543 3.479 3.458 0 .694-.206 1.339-.558 1.879l2.193 2.72a2.152 2.152 0 012.45 1.558l2.428 8.993a2.151 2.151 0 01-1.524 2.64l-1.259.335a2.151 2.151 0 01-2.63-1.518l-2.428-8.993a2.152 2.152 0 011.315-2.573l-1.674-2.077a3.48 3.48 0 01-1.792.494 3.48 3.48 0 01-1.792-.494L8.535 10.12a2.152 2.152 0 011.315 2.573l-2.428 8.992a2.151 2.151 0 01-2.63 1.519l-1.26-.335a2.151 2.151 0 01-1.523-2.64l2.428-8.993a2.152 2.152 0 012.45-1.558l2.193-2.72a3.426 3.426 0 01-.558-1.879zm7.136 7.207a.591.591 0 01.42-.726l1.258-.334a.591.591 0 01.723.417l2.428 8.993a.591.591 0 01-.419.725l-1.259.335a.591.591 0 01-.723-.417l-2.428-8.993zm-7.314 0a.591.591 0 00-.42-.726l-1.258-.334a.591.591 0 00-.723.417l-2.428 8.993a.591.591 0 00.419.725l1.259.335a.591.591 0 00.723-.417l2.428-8.993z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default EquipmentSvgIcon;