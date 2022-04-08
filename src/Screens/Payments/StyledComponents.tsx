import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components";

import { APP_CONSTANTS } from "../../Constants";
import { Colors, Metrics } from "../../Themes";
import { PaymentComponentSectionHeadingContentContainerProps } from "./types";

export const DrawerMiddleContentContainer = styled(View)`
  width: 90%;
`;

export const PaymentsComponentConnectedAccountsTextStyle = styled(View)`
  justify-content: center;
  align-items: flex-start;
  margin-left: ${Metrics.doubleBaseMargin};
`;

export const PaymentsComponentConnectedAccountsContentButtonStyle = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const PaymentsScreenContainer = styled(View)`
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  margin-bottom: ${Metrics.doubleBaseMargin};
  margin-top: ${Metrics.baseMargin};
`;

export const PaymentsComponentSubSectionsTextStyle = styled(View)`
  margin-bottom: ${Metrics.baseMargin};
`;

export const PaymentsComponentActionButtonsWithOpacityStyle = styled(TouchableOpacity)`
  border-width: 1;
  border-color: ${Colors.lightGrey};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  padding-vertical: ${Metrics.doubleBaseMargin};
  margin-top: ${Metrics.baseMargin};
  border-radius: ${Metrics.smallMargin};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PaymentsComponentActionButtonsWithoutOpacityStyle = styled(View)`
  border-width: 1;
  border-color: ${Colors.lightGrey};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  padding-vertical: ${Metrics.doubleBaseMargin};
  margin-top: ${Metrics.baseMargin};
  border-radius: ${Metrics.smallMargin};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PaymentsComponentBulletPointsSectionContainerStyle = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const PaymentsComponentBulletPointContainerStyle = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: ${Metrics.baseMargin};
  width: 50%;
`;

export const PaymentsComponentDrawerContainerStyle = styled(View)`
  width: ${Metrics.screenWidth - Metrics.newScreenHorizontalPadding * 2};
`;

export const PaymentsComponentSaveActionButtonsContainerStyle = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Metrics.baseMargin};
  margin-bottom: ${Metrics.baseMargin};
  margin-left: ${APP_CONSTANTS.IS_ANDROID ? 1 : 0};
`;

export const PaymentsComponentSecondaryButtonConatinerStyle = styled(View)``;

export const PaymentsComponentSectionHeadingContainer = styled(View)`
  flex-direction: row;
  padding-bottom: ${Metrics.smallMargin};
`;

export const PaymentsComponentSectionHeadingContentContainer = styled((props) => <View {...props} />)<PaymentComponentSectionHeadingContentContainerProps>`
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : "flex-start")};
  align-items: ${(props) => props.alignItems};
  width: ${(props) => props.width};
`;

export const PaymentsComponentBulletPointStyle = styled(View)<{
  backgroundColor: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${Metrics.baseMargin};
  width: 6;
  height: 6;
`;

export const DividerStyle = styled(View)<{
  marginTop: number;
}>`
  border-bottom-width: 1;
  border-bottom-color: ${Colors.dimGrey};
  width: 100%;
  margin-top: ${({ marginTop }) => marginTop};
`;
