import * as React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { propOr } from "ramda";

import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import APP_CONSTANTS from "Constants/AppConstants";
import { Fonts } from "Themes";

export const ClaimCardContainer = styled(TouchableOpacity)`
  border-radius: 7;
  background-color: ${Colors.charcoalGrey};
  margin-top: ${Metrics.baseMargin + 6};
  padding-vertical: ${Metrics.baseMargin + 6};
  padding-horizontal: ${Metrics.baseMargin + 6};
  border-width: 0.3;
  border-color: ${Colors.darkGrey};
`;

export const buttonWidth = Dimensions.get("screen").width - 20;

export const ClaimsListContainer = styled(View)`
  flex: 1;
  background-color: ${Colors.white};
`;

export const FilterDrawerHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${Metrics.doubleBaseMargin};
  padding-horizontal: ${Metrics.doubleBaseMargin};
`;

export const FilterDrawerContent = styled(View)`
  margin-top: ${Metrics.doubleBaseMargin};
  margin-bottom: ${Metrics.baseMargin};
`;

export const ProgramPolicyContainer = styled(View)`
  background-color: ${Colors.lightOrange};
  margin-vertical: ${Metrics.doubleBaseMargin};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  padding-vertical: ${Metrics.screenHorizontalPadding};
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ClaimScreenHeaderActionButtons = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 50%;
`;
export const DotContainerStyle = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  width: ${Metrics.baseMargin};
  justify-content: center;
`;

export const DotStyle = styled(View)`
  background-color: ${Colors.charcoalLightGrey};
  width: 3;
  height: 3;
  border-radius: 5;
  margin-bottom: ${APP_CONSTANTS.IS_ANDROID ? Fonts.size.small / 4 : Fonts.size.small / 3};
`;
