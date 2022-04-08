import * as React from "react";
import { has, propOr } from "ramda";
import { View, Text, FlexStyle } from "react-native";
import styled from "styled-components/native";

import { TransparentButtonsBorder, AppScreenTitle } from "Components/Commons";
import APP_CONSTANTS from "Constants/AppConstants";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import { AccountCardBorderContainerProps, AccountCardSectionProps, ContentSectionContainerProps, DetailedAccountInfoCardBodySectionProps, SaveActionButtonsContainerStyleType } from "./types";
import type { AccountCardAmountContainerProps } from "./types";
import { Fonts } from "Themes";

export const AccountDetailScreenContainer = styled.View`
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  padding-top: ${Metrics.baseMargin};
`;

export const AccountCardBorderContainer = styled((props) => <View {...props} />)<AccountCardBorderContainerProps>`
  padding-top: 15px;
  padding-bottom: 15px;
  width: 100%;
  justify-content: center;
  ${(props) => !APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: Metrics.smallMargin, borderColor: props.borderColor })};
  background-color: ${Colors.white};
  border-radius: ${Metrics.baseMargin};
`;

export const AccountCardContentContainer = styled(View)`
  flex-direction: row;
  align-self: center;
`;

export const AccountCardAmountContainer = styled((props) => <View {...props} />)<AccountCardAmountContainerProps>`
  padding-horizontal: ${Metrics.baseMargin + 5};
  padding-vertical: ${Metrics.smallMargin};
  border-radius: ${Metrics.smallMargin};
  background-color: ${(props) => propOr(Colors.lightOrange, "backgroundColor", props)};
  justify-content: center;
`;
export const AccountsListHeader = styled(Text)`
  color: ${Colors.newCharcoalDarkGrey};
  margin-bottom: 7px;
  margin-top: 10px;
`;
export const AccountCardSection = styled(View)<AccountCardSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
  justify-content: center;
`;

//DetailedAccountInfoCard Component Styles
export const DetailedAccountInfoCardHeaderContainer = styled.View`
  margin-vertical: ${Metrics.baseMargin};
  flex-direction: row;
  justify-content: space-between;
`;

export const SaveActionButtonsContainerStyle = styled(View)<SaveActionButtonsContainerStyleType>`
  flex-direction: row;
  justify-content: ${(props) => propOr("space-between", "justifyContent")(props)};
  margin-top: ${Metrics.doubleBaseMargin};
  margin-bottom: ${Metrics.baseMargin};
  margin-left: ${APP_CONSTANTS.IS_ANDROID ? 1 : 0};
`;

export const SecondaryButtonContainerStyle = styled.View``;
export const CardDetailsWrapper = styled.View`
  display: flex;
  align-items: center;
  padding-bottom: ${Metrics.doubleBaseMargin};
`;
export const DetailedAccountInfoCardBackgroundImage = styled.ImageBackground`
  width: ${Metrics.screenWidth + 6 - Metrics.screenHorizontalPadding * 2};
  margin-vertical: ${Metrics.baseMargin};
  margin-left: ${-3};
  height: 120;
  justify-content: center;
`;

export const DetailedAccountInfoCardBodySection = styled(View)<DetailedAccountInfoCardBodySectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
  justify-content: center;
`;

export const RsaExpiredSectionContainer = styled.View`
  background-color: ${Colors.white};
  margin-vertical: ${Metrics.baseMargin};
`;

export const ContentSectionContainer = styled(View)<ContentSectionContainerProps>`
  border-bottom-color: ${Colors.dimGrey};
  flex-direction: row;
  justify-content: space-between;
`;

export const ContentLeftSection = styled.View`
  width: 50%;
`;

//ViewTwicCard Component Styles
export const DrawerContentContainerStyle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin-top: ${Metrics.doubleBaseMargin};
`;

export const HsaAccountTransactionTileContainer = styled(View)`
  padding-vertical: ${Metrics.smallMargin + 3};
  margin-horizontal: ${Metrics.screenHorizontalPadding};
`;
export type TileSectionProps = {
  flex?: number; //Colors
  alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};

export const HsaAccountTransactionTileSection = styled(View)<TileSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
`;

export const PreTaxTransactionTileContainer = styled(View)`
  padding-vertical: ${Metrics.smallMargin + 3};
  margin-horizontal: ${Metrics.baseMargin + 5};
  flex: 1;
`;

export const PreTaxTransactionTileSection = styled(View)<TileSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
`;

export const PostTaxTransactionTileContainer = styled(View)`
  padding-vertical: ${Metrics.smallMargin};
`;

export const PostTaxTransactionTileSection = styled(View)<TileSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
  padding-left: ${(props) => propOr(0, "paddingLeft", props)};
`;

export const SectionListHeaderContainer = styled(View)`
  background-color: ${Colors.grey};
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  padding-vertical: ${Metrics.baseMargin - 2};
`;

export const CardContainer = styled.View`
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.baseMargin};
  margin-bottom: ${Metrics.baseMargin + Metrics.smallMargin};
  border-color: ${Colors.dimGrey};
  border-radius: 3;
  border-width: 1;
`;
export const CardRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const CardContentRow = styled(CardRow)<ContentSectionContainerProps>`
  border-bottom-width: ${(props) => propOr(0, "borderBottomWidth", props)};
  padding-top: ${(props) => propOr(Metrics.baseMargin, "paddingTop", props)};
  padding-bottom: ${Metrics.baseMargin};
  border-bottom-color: ${Colors.dimGrey};
`;

export const HeaderStyle = styled(AppScreenTitle)`
  max-width: 240;
`;
export type AccountLogoAndTitleSectionProps = {
  flex?: number;
  alignItems?: FlexStyle["alignItems"];
  justifyContent?: FlexStyle["justifyContent"];
};

export const AccountLogoAndTitleSection = styled(View)<AccountLogoAndTitleSectionProps>`
  font-size: ${Fonts.size.h1 + 4};
  max-width: 240;
  padding-top: 10;
`;
