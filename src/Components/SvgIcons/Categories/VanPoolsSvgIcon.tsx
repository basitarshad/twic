import * as React from "react";
import Svg, { Path } from "react-native-svg";

function VanPoolsSvgIcon(props) {
  const { fillColor = "#22222D" } = props;
  return (
    <Svg width={24} height={18} viewBox="0 0 24 16" fill="none" {...props}>
      <Path
        d="M22.48 5.576l-3.93-3.932a2.61 2.61 0 00-1.857-.769H1.875A1.125 1.125 0 00.75 2v9a1.877 1.877 0 001.875 1.875h.405a2.622 2.622 0 005.19 0h7.56a2.622 2.622 0 005.19 0h1.155a1.125 1.125 0 001.125-1.125V7.432a2.608 2.608 0 00-.77-1.856zm-.514.549H15v-3h3.97l2.98 2.981c.007.006.01.013.016.019zm-7.716 0H3v-3h11.25v3zM1.5 11V8.375h1.125v-.75H1.5V2a.375.375 0 01.375-.375h14.818a1.865 1.865 0 011.326.549l.2.201H3a.75.75 0 00-.75.75v3a.75.75 0 00.75.75h11.25v5.25H8.22a2.622 2.622 0 00-5.19 0h-.405A1.125 1.125 0 011.5 11zm4.125 3.375a1.875 1.875 0 110-3.75 1.875 1.875 0 010 3.75zm12.75 0a1.875 1.875 0 110-3.75 1.875 1.875 0 010 3.75zm3.75-2.25H20.97a2.622 2.622 0 00-5.19 0H15v-5.25h7.407c.059.18.09.368.093.557v.193h-1.125a1.125 1.125 0 000 2.25H22.5v.75h-1.125v.75H22.5v.375a.375.375 0 01-.375.375zm.375-3.75v.75h-1.125a.375.375 0 010-.75H22.5z"
        fill={fillColor}
      />
    </Svg>
  );
}

export default VanPoolsSvgIcon;