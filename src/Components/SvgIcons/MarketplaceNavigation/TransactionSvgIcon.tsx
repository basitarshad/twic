import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { SvgIconType } from "../../../types";

const TransactionSvgIcon = (props: SvgIconType & { strokeWidth?: number }) => {
  const { fillColor = "#3C3D47", strokeWidth = 1.3 } = props;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" {...props}>
      <Path
        fill="none"
        stroke={fillColor}
        strokeWidth={strokeWidth}
        d="M26.039 5v22l-1.904-2-1.904 2-1.904-2-1.904 2-1.904-2-1.903 2-1.904-2-1.904 2-1.904-2L7 27V5l1.904 2 1.904-2 1.904 2 1.904-2 1.903 2 1.904-2 1.904 2 1.904-2 1.904 2 1.904-2zm-15.267 5.702h11m-11 4.671h8.333m-8.333 4.663h5.666"
      />
    </Svg>
  );
};

export default TransactionSvgIcon;
