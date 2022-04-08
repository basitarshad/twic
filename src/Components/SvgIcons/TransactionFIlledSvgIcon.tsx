import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { SvgIconType } from "../../types";
import { Colors } from "../../Themes";

type TransactionSvgIconProp = SvgIconType & {
  style?: any;
};
const TransactionSvgIcon = (props: TransactionSvgIconProp) => {
  const { fillColor = Colors.charcoalDarkGrey } = props;

  return (
    <Svg
      width={21}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.78 4a.78.78 0 00-1.342-.54l-.838.87-.838-.87a.78.78 0 00-1.124 0l-.838.87-.838-.87a.78.78 0 00-1.124 0L12 4.33l-.838-.87a.78.78 0 00-1.124 0l-.838.87-.838-.87a.78.78 0 00-1.124 0l-.838.87-.838-.87A.78.78 0 004.22 4v16a.78.78 0 001.342.541l.838-.87.838.87a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.342-.54V4zm-7.218 1.996l.838-.871.838.87a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.124 0l.058-.06v12.13l-.058-.06a.78.78 0 00-1.124 0l-.838.87-.838-.87a.78.78 0 00-1.124 0l-.838.87-.838-.87a.78.78 0 00-1.124 0l-.838.87-.838-.87a.78.78 0 00-1.124 0l-.838.87-.838-.87a.78.78 0 00-1.124 0l-.058.06V5.935l.058.06a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.124 0l.838-.87.838.87a.78.78 0 001.124 0zM8 7.744a.78.78 0 000 1.56h8a.78.78 0 100-1.56H8zm-.78 3.847c0-.431.35-.78.78-.78h7a.78.78 0 110 1.56H8a.78.78 0 01-.78-.78zM8 13.87a.78.78 0 100 1.56h4a.78.78 0 100-1.56H8z"
        fill={fillColor}
      />
    </Svg>
  );
};

export default TransactionSvgIcon;
