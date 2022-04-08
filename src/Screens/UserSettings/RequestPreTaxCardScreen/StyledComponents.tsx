import { View, Text } from "react-native";
import styled from "styled-components/native";

import { APP_CONSTANTS } from "../../../Constants";
import { Colors, Fonts, Metrics } from "../../../Themes";

export const RequestPretaxCardSubmitButtonContainer = styled(View)`
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-bottom: 20px;
`;

export const RequestPretaxCardContainer = styled(View)`
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  padding-bottom: ${Metrics.doubleBaseMargin};
  margin-top: 10;
  height: 100%;
`;

export const RequestPreTaxCardSubmissionPageContainer = styled(View)`
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  height: 100%;
  padding-bottom: ${Metrics.doubleBaseMargin};
`;

export const RequestPreTaxCardSubmissionMiddleSectionContainer = styled(View)`
  justify-content: space-between;
  align-items: center;
`;

export const RequestPreTaxCardSubmissionDescriptionContainer = styled(Text)`
  font-size: ${APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.h4};
  color: ${Colors.charcoalDarkGrey};
  padding-horizontal: ${Metrics.smallMargin};
  padding-vertical: ${Metrics.smallMargin};
  font-family: TTCommons-regular;
  text-align: center;
`;

export const RequestPreTaxCardSubmissionContentConatiner = styled(View)`
  justify-content: space-between;
  flex: 2;
`;

export const RequestPreTaxCardSubmissionIconContainer = styled(View)`
  padding-bottom: ${Metrics.baseMargin};
  padding-top: ${Metrics.doubleBaseMargin + Metrics.doubleBaseMargin};
`;
