import { View, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Metrics, Colors } from "Themes";
import { AddElementShadow } from "Components/Commons/ElementShadow";
import { ReimbursementDetailScreenSectionContentContainerProps } from "./types";

export const ReimbursementDetailScreenSectionContentContainer = styled(View)<ReimbursementDetailScreenSectionContentContainerProps>`
  flex: 1;
  justify-content: ${(props) => props.justifyContent || "flex-start"};
  align-items: ${(props) => props.alignItems};
`;

export const ReimbursementDetailScreenSectionItemContainer = styled(View)<{ borderTop?: string }>`
  flex-direction: row;
  padding-vertical: ${Metrics.doubleBaseMargin - 5};
  border-top-color: ${Colors.dimGrey};
  border-top-width: ${(props) => props.borderTop || "1px"};
`;
export const ReimbursementDetailScreenSectionContainer = styled(View)`
  flex-direction: row;
  padding-bottom: ${Metrics.smallMargin};
`;

export const ReimbursementDetailScreenContainer = styled(View)`
  padding-vertical: ${Metrics.baseMargin + 3};
`;
export const ArrowContainer = styled(TouchableOpacity)`
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  right: 0;
  top: 16;
  z-index: 100;
  ${AddElementShadow()}
`;
