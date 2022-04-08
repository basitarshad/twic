import { propOr } from "ramda";
import { Dimensions, View, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { AddElementShadow } from "../../Components/Commons/ElementShadow";

import { Colors, Metrics } from "../../Themes";
import { AboutSectionHeadingContentContainerProps, CarouselContainerProps, CarouselImageProps, CarouselPaginationDotProps, ProductCardContainerType, ProductCardContentProps } from "./types";

const { width, height } = Dimensions.get("window");

export const AboutSectionHeadingContainer = styled(View)`
  flex-direction: row;
  padding-bottom: ${Metrics.smallMargin};
`;

export const AboutSectionHeadingContentContainer = styled(View)<AboutSectionHeadingContentContainerProps>`
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : "flex-start")};
  align-items: ${(props) => props.alignItems};
  width: ${(props) => props.width};
`;

export const FaqContentContainer = styled(View)`
  flex-direction: row;
  padding-top: ${Metrics.doubleBaseMargin};
  align-items: center;
`;

export const FaqScreenContainer = styled(View)`
  padding-vertical: ${Metrics.baseMargin + 2};
  padding-top: ${Metrics.baseMargin + 2};
`;

const carouselHeight = height / 3.5;

export const CarouselContainer = styled(View)<CarouselContainerProps>`
  height: ${(props) => propOr(carouselHeight, "height")(props)};
  width: 100%;
`;
export const CarouselImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

export const CarouselImage = styled(Image)<CarouselImageProps>`
  height: ${(props) => propOr(carouselHeight, "height")(props)};
  width: ${(props) => propOr(width, "width")(props)};
  align-self: center;
`;
export const CarouselPaginationDot = styled(View)<CarouselPaginationDotProps>`
  background-color: ${(props) => (props.active ? Colors.white : Colors.darkGrey)};
  width: 4;
  height: 4;
  border-radius: 4;
  margin-horizontal: 3;
  margin-vertical: 3;
`;
export const CarouselPaginationContainer = styled(View)`
  background-color: ${Colors.black};
  position: absolute;
  height: 17;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  bottom: -8;
  padding-horizontal: 8;
  border-radius: 3;
`;

export const ProductListingContainer = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  padding-horizontal: ${Metrics.newScreenHorizontalPadding - 5};
  padding-top: ${Metrics.doubleBaseMargin - 5};
  padding-bottom: ${Metrics.smallMargin};
`;

export const ProductCardContainer = styled(TouchableOpacity)<ProductCardContainerType>`
  border-radius: ${Metrics.baseMargin};
  width: 200px;
  margin-vertical: 4px;
  margin-horizontal: 4px;
  padding-vertical: ${Metrics.baseMargin};

  ${(props) => AddElementShadow({ backgroundColor: props.backgroundColor })}
`;

export const ProductCardContentContainer = styled.View`
  flex-direction: row;
  padding-horizontal: ${Metrics.baseMargin};
`;

export const ProductCardContent = styled(View)<ProductCardContentProps>`
  width: ${(props) => props.width};
  justify-content: center;
  align-items: ${(props) => (props.alignItems ? props.alignItems : "flex-start")};
  padding-right: ${(props) => propOr(0, "paddingRight", props)};
`;
