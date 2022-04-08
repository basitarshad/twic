import * as React from "react";
import { propOr, has } from "ramda";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import styled from "styled-components";

import { AddElementShadow } from "Components/Commons/ElementShadow";
import { TransparentButtonsBorder } from "Components/Commons";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import ApplicationStyles from "Themes/ApplicationStyles";
import APP_CONSTANTS from "Constants/AppConstants";

import { CategoryCardSectionProps, CategoryCardContainerProps } from "./types";

//TODO: have to move style in its file with styled components
export const styles = StyleSheet.create<any>({
  container: {
    ...ApplicationStyles.container,
    paddingHorizontal: Metrics.screenHorizontalPadding,
  },
  categoriesHeader: {
    flexDirection: "row",
    paddingBottom: Metrics.doubleBaseMargin - 5,
    paddingTop: Metrics.doubleBaseMargin,
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoriesContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  whiteCross: { resizeMode: "contain", width: 20, height: 20, alignSelf: "flex-end", marginRight: 20, marginTop: 20 },
  rebrandImg: {
    resizeMode: "contain",
    width: Metrics.screenWidth,
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  learnMoreBtn: { marginVertical: 15, paddingHorizontal: 30, paddingVertical: 10, marginBottom: 120 },
});

export const CategoryCardTitleContainer = styled(View)`
  flex-direction: row;
  align-self: center;
`;

export const CategoryCardContainer = styled(View)<CategoryCardContainerProps>`
  height: 60;
  width: 100%;
  padding-horizontal: ${Metrics.baseMargin};
  justify-content: center;
  ${(props) => !APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: Metrics.smallMargin, borderColor: props.borderColor })};
  background-color: ${Colors.white};
  border-radius: ${Metrics.baseMargin};
`;

export const CategoryCardSection = styled(View)<CategoryCardSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
  justify-content: center;
`;

export const HomeScreenEmptyVendorsContentView = styled(View)`
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  padding-top: ${Metrics.screenHorizontalPadding};
`;

export const StoreCard = styled(View)`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const StoreButtonLink = styled(TouchableOpacity)`
  padding: 0px 20px;
  border: 1px solid rgba(209, 212, 219, 0.55);
  height: 45px;
  border-radius: 7px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${AddElementShadow({ shadowOpacity: 0.1 })}
`;
export const ContentWrapper = styled(View)`
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: ${Metrics.newScreenHorizontalPadding};
  margin-right: ${Metrics.newScreenHorizontalPadding};
`;
export const StoreLinkWrapper = styled(View)`
  margin-top: 20px;
  background-color: #fbfbfc;
  border-radius: 8px;
`;
export const ImagePlus = styled(Image)`
  position: absolute;
  bottom: 15px;
  right: 10px;
  width: 50px;
  height: 50px;
`;
export const LookingToShopWrapper = styled(View)`
  background-color: rgba(216, 214, 255, 0.25);
  padding: 16px 30px;
  border-radius: 8px;
  position: relative;
`;
export const StoreCardImage = styled(Image)`
  height: 65;
  width: 100%;
  resize-mode: contain;
  margin-bottom: 20px;
`;
export const LookingToShopHeader = styled(Text)`
  font-size: 26;
  font-weight: 700;
  color: #22222d;
  line-height: 32px;
`;
