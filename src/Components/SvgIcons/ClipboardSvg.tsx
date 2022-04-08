import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../Themes";

export const ClipboardSvgIcon = (props) => {
  const { fillColor = Colors.white, strokeWidth = "1.3", ...prop } = props;

  return (
    <Svg
      width={21}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.42 3.225A2.805 2.805 0 013.225.42h12.15a2.805 2.805 0 012.805 2.805V4.47h2.595a2.805 2.805 0 012.805 2.805v13.5a2.805 2.805 0 01-2.805 2.805H8.625a2.805 2.805 0 01-2.805-2.805V19.53H3.225A2.805 2.805 0 01.42 16.725v-13.5zM7.38 19.53v1.245c0 .688.557 1.245 1.245 1.245h12.15c.688 0 1.245-.557 1.245-1.245v-13.5c0-.688-.557-1.245-1.245-1.245H18.18v10.695a2.805 2.805 0 01-2.805 2.805H7.38zm7.995-17.55c.688 0 1.245.557 1.245 1.245V4.47H8.625A2.805 2.805 0 005.82 7.275V17.97H3.225a1.245 1.245 0 01-1.245-1.245v-13.5c0-.688.557-1.245 1.245-1.245h12.15zM7.38 17.97h7.995c.688 0 1.245-.557 1.245-1.245V6.03H8.625c-.688 0-1.245.557-1.245 1.245V17.97z"
        fill={fillColor}
      />
    </Svg>
  );
};
