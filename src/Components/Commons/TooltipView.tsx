import * as React from "react";
import { ReactNode } from "react";
import Tooltip from "rn-tooltip";
import { Colors, Fonts } from "../../Themes";
import { AppText } from "./AppStyledComponents";

const TooltipViewContainer = { backgroundColor: Colors.dimGrey };

type TooltipViewProps = {
  pointerColor?: string;
  value: string;
  height?: number;
  withOverlay?: boolean;
  containerStyle?: object;
  children?: ReactNode;
  actionType?: "press" | "longPress" | "none";
  popOverTextColor?: string;
};
const TooltipView = (props: TooltipViewProps) => {
  const { pointerColor = Colors.dimGrey, containerStyle = TooltipViewContainer, value = "", height = 30, withOverlay = true, actionType = "press", popOverTextColor = "black" } = props;
  return (
    <Tooltip
      width={240}
      pointerColor={pointerColor}
      height={height}
      withOverlay={withOverlay}
      containerStyle={containerStyle}
      actionType={actionType}
      popover={
        <AppText fontSize={Fonts.size.medium} color={popOverTextColor}>
          {value}
        </AppText>
      }
    >
      {props.children}
    </Tooltip>
  );
};

export default TooltipView;
