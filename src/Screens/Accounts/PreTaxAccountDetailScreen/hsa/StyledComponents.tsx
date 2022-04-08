import * as React from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { has, propOr } from "ramda";

import { Colors, Metrics } from "../../../../Themes";
import { AccountLogoAndTitleSectionProps, ContributionDetailsBarCheckBoxProps, ContributionDetailsBarDetailsProps, ContributionDetailsBarProps, HelpTooltipContainerProps, ContentSectionContainerProps, HsaTransactionsTabStyledType } from "./types";
import { APP_CONSTANTS } from "../../../../Constants";

// HsaAccountCardContribution Styles
export const HsaAccountCardContributionContainer = styled.View`
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  margin-vertical: ${Metrics.baseMargin + Metrics.smallMargin};
  border-color: ${Colors.dimGrey};
  border-radius: 3;
  border-width: 1;
`;

export const HsaTransactionsTwicCardTabs = styled(View)`
  flex-direction: row;
  border-bottom-width: 1;
  border-bottom-color: ${Colors.lightGrey};
  margin-top: ${Metrics.doubleSection};
  margin-bottom: ${Metrics.doubleBaseMargin};
`;

export const HsaTransactionsTabStyled = styled(TouchableOpacity)<HsaTransactionsTabStyledType>`
  width: 50%;
  align-items: center;
  ${({ activeTab }) =>
    activeTab
      ? {
          paddingBottom: Metrics.baseMargin,
          borderBottomWidth: 3,
          borderBottomColor: Colors.black,
        }
      : ""}
`;
export const HsaAccountCardContributionHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 10;
`;

export const ContributionsYTDSectionContainer = styled.View`
  background-color: ${Colors.white};
`;

export const ContributionDetailsContainer = styled.View`
  margin-top: 5;
`;

export const ContributionDetailsBarContainer = styled.View`
  background-color: ${Colors.dimGrey};
  height: 20;
  flex-direction: row;
`;

export const ContributionDetailsBar = styled(View)<ContributionDetailsBarProps>`
  width: ${(props) => propOr(0, "width", props)};
  background-color: ${(props) => propOr(Colors.error, "backgroundColor", props)};
  height: 20;
`;

export const ContributionDetailsBarDetailsContainer = styled(View)<ContributionDetailsBarDetailsProps>`
  border-bottom-width: ${(props) => propOr(0, "borderBottomWidth", props)};
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${Metrics.baseMargin};
  border-bottom-color: ${Colors.dimGrey};
`;

export const ContributionDetailsBarInnerContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ContributionDetailsBarCheckbox = styled(View)<ContributionDetailsBarCheckBoxProps>`
  background-color: ${(props) => propOr(Colors.dimGrey, "backgroundColor", props)};
  height: ${Metrics.baseMargin + 2};
  width: ${Metrics.baseMargin + 2};
  border-radius: 3;
`;

export const YearToDatePickerContainer = styled.View`
  width: 50%;
`;

export const SaveActionButtonsContainerStyle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Metrics.smallMargin};
  margin-bottom: ${Metrics.baseMargin};
  padding-left: ${APP_CONSTANTS.IS_ANDROID ? 1 : 0};
  padding-right: ${APP_CONSTANTS.IS_ANDROID ? 1 : 0};
`;

export const SecondaryButtonContainerStyle = styled.View``;

// HsaAccountCardInvestment Styles
export const HsaAccountCardInvestmentBackgroundImage = styled(ImageBackground)`
  width: 100%;
  border-radius: 5;
  padding-left: 25;
  padding-top: 25;
  height: auto;
  padding-bottom: 20;
`;

export const HelpTooltipContainer = styled(View)<HelpTooltipContainerProps>`
  margin-left: ${-Metrics.baseMargin - 2};
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
`;

export const HsaHasAccountContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TotalInvestmentCardContainer = styled.View`
  margin-top: ${Metrics.doubleBaseMargin};
  padding-top: ${Metrics.screenHorizontalPadding};
`;

//HsaAccountDetails Styles
export const HsaAccountCardContainer = styled.View`
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  margin-vertical: ${Metrics.baseMargin + Metrics.smallMargin};
  border-color: ${Colors.dimGrey};
  border-radius: 3;
  border-width: 1;
`;

export const HsaAccountCardHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ShowMoreButton = styled(TouchableOpacity)`
  color: ${Colors.blue};
`;

export const ContentSectionContainer = styled(View)<ContentSectionContainerProps>`
  border-bottom-width: ${(props) => propOr(0, "borderBottomWidth", props)};
  padding-top: ${(props) => propOr(Metrics.baseMargin, "paddingTop", props)};
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${Metrics.baseMargin};
  border-bottom-color: ${Colors.dimGrey};
`;
