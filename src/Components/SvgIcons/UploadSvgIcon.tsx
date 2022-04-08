import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "Themes";

const UploadSvgIcon = (props) => {
  const { fillColor = Colors.black, height=18, width= 18 } = props;
  return (
    <Svg width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.498 7.302a.78.78 0 001.103 0L8.22 3.683v9.403a.78.78 0 101.56 0V3.657l3.877 3.802a.78.78 0 101.092-1.113L9.547 1.244l-.012-.011A.777.777 0 009 1.02h-.002a.777.777 0 00-.55.228l-4.95 4.95a.78.78 0 000 1.104zm.102 9.264a.78.78 0 110-1.56h10.8a.78.78 0 110 1.56H3.6z"
        fill={fillColor}
      />
    </Svg>
  );
};

export default UploadSvgIcon;
