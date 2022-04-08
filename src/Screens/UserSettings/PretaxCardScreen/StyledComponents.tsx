import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import styled from "styled-components/native";

import { AddElementShadow } from "../../../Components/Commons/ElementShadow";
import { APP_CONSTANTS } from "../../../Constants";
import { Colors, Fonts, Metrics } from "../../../Themes";

const screenWidth = Dimensions.get("window").width - Metrics.screenHorizontalPadding * 2;

export const ArrowContainer = styled(TouchableOpacity)`
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  right: 1;
  top: 16;
  z-index: 100;
  ${AddElementShadow()}
`;

export const ImageContainer = styled(View)`
  width: 100%;
  height: 50;
  align-items: flex-end;
`;

export const AddressStyle = styled(Text)`
  padding-vertical: ${Metrics.smallMargin};
  font-size: ${Fonts.size.small};
  color: ${Colors.charcoalDarkGrey};
`;

export const CopyViewContainer = styled(View)`
  padding-vertical: ${Metrics.smallMargin};
`;

export const DescriptionContainer = styled(Text)`
  font-size: ${APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.h4};
  color: ${Colors.charcoalDarkGrey};
  padding-horizontal: ${Metrics.baseMargin};
  margin-top: ${Metrics.doubleBaseMargin + Metrics.doubleBaseMargin};
  margin-bottom: ${Metrics.doubleBaseMargin - 5};
  font-family: TTCommons-regular;
`;

export const SecondaryButtonContainer = styled(View)`
  align-items: flex-start;
  margin-left: 0.5;
`;

export const CarouselContainer = styled(View)<{ carouselContainerHeight: number }>`
  height: ${({ carouselContainerHeight }) => carouselContainerHeight};
  width: 100%;
  margin-bottom: ${Metrics.baseMargin};
`;

export const PreTaxCardContainer = styled(View)`
  width: ${Metrics.screenWidth - 32};
  align-items: center;
`;

export const CardStyle = styled(View)<{
  count: number;
}>`
  min-width: ${screenWidth / 2};
  ${({ count }) =>
    count > 0 && {
      paddingLeft: 20,
      borderLeftWidth: 1,
      borderLeftColor: Colors.dimGrey,
    }};
`;
