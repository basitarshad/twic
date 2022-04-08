import * as React from "react";
import Svg, { Path } from "react-native-svg";

function GymAndFitnessSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={54} height={51} viewBox="0 0 54 51" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.8 15.62a.78.78 0 00-.78.78v7.2a.78.78 0 101.56 0v-6.42h4.44v.84H34.4a.78.78 0 100 1.56h1.62v2.04H34.4a.78.78 0 100 1.56h1.62v2.04H34.4a.78.78 0 100 1.56h1.62v2.04h-.42a.78.78 0 100 1.56h.42v4.44H33.2a.78.78 0 100 1.56h3.6c.43 0 .78-.35.78-.78V16.4a.78.78 0 00-.78-.78h-6zM20.78 28.4v2.22h6.84V28.4a1.98 1.98 0 013.96 0v.465a1.98 1.98 0 012.4 1.935V32a1.98 1.98 0 01-2.4 1.935v.465a1.98 1.98 0 01-3.96 0v-2.22h-6.84v2.22a1.98 1.98 0 01-3.96 0v-.465A1.98 1.98 0 0114.42 32v-1.2a1.98 1.98 0 012.4-1.935V28.4a1.98 1.98 0 013.96 0zm9.24 3.6V28.4a.42.42 0 00-.84 0v6a.42.42 0 00.84 0V32zm1.56 0a.42.42 0 00.84 0v-1.2a.42.42 0 00-.84 0V32zm-14.76 0a.42.42 0 01-.84 0v-1.2a.42.42 0 01.84 0V32zm1.56 2.4v-6a.42.42 0 01.84 0V34.401a.42.42 0 11-.84 0z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default GymAndFitnessSvgIcon;
