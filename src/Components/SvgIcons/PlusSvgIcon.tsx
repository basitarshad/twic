import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "Themes";

export const PlusSvgIcon = (props) => {
  const { fillColor = Colors.white } = props;

  return (
    <Svg width={21} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M12.78 4.8a.78.78 0 10-1.56 0v6.42H4.8a.78.78 0 100 1.56h6.42v6.42a.78.78 0 101.56 0v-6.42h6.42a.78.78 0 100-1.56h-6.42V4.8z" fill={fillColor} />
    </Svg>
  );
};
