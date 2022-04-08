import * as React from "react";
import Svg, { Path, G } from "react-native-svg";
import { SvgIconType } from "../../types";
import { Colors } from "../../Themes";

const ReportSvgIcon = (props: SvgIconType) => {
  const { fillColor = Colors.primaryText } = props;

  return (
    <Svg width="20" height="20" viewBox="0 0 20 20">
      <G fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <G stroke={fillColor} stroke-width="1.3">
          <G>
            <G>
              <Path d="M4 2h12c.552 0 1 .448 1 1v14c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V3c0-.552.448-1 1-1zm1.978 8h6.01m-6.01-4h8.01m-8.01 8h3.04" transform="translate(-680 -10) translate(670) translate(10 10)" />
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default ReportSvgIcon;
