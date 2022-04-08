import * as React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowLeftSvgIcon = (props) => {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.5002 3.66721C11.818 3.37632 11.8397 2.88293 11.5488 2.5652C11.258 2.24746 10.7646 2.22569 10.4468 2.51658L0.75748 11.3871C0.600575 11.5298 0.502075 11.7356 0.502075 11.9643C0.502075 11.9683 0.502105 11.9723 0.502164 11.9762C0.505496 12.1991 0.602288 12.3993 0.755086 12.5394L10.4444 21.4842C10.761 21.7764 11.2544 21.7566 11.5466 21.4401C11.8389 21.1236 11.8191 20.6301 11.5026 20.3379L3.27692 12.7443H22.7179C23.1487 12.7443 23.4979 12.3951 23.4979 11.9643C23.4979 11.5336 23.1487 11.1843 22.7179 11.1843H3.2892L11.5002 3.66721Z"
        fill={fillColor}
      />
    </Svg>
  );
};
export default ArrowLeftSvgIcon;
