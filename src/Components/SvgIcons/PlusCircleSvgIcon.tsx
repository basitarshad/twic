import * as React from "react";
import Svg, { G, Path, Circle } from "react-native-svg";

const PlusCircleSvgIcon = (props) => {
  const { fillColor = "#528BEF", showCircle = true, height = 20, width = 21 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" {...props}>
      <G fill="none" fillRule="evenodd" stroke={fillColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
        <Path d="M10.5 6.5v8m-4-4h8" />
        {showCircle && <Circle cx={10.5} cy={10.5} r={9} />}
      </G>
    </Svg>
  );
};

export default PlusCircleSvgIcon;
