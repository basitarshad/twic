import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { propOr } from "ramda";

import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import { TransparentButtonsBorder } from "Components/Commons/AppStyledComponents";
import APP_CONSTANTS from "Constants/AppConstants";
import { AddElementShadow } from "Components/Commons/ElementShadow";

export const PickerFieldContainerForIos = styled(View)`
  padding-horizontal: 15px;
  padding-vertical: 15px;
  background-color: ${Colors.white};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-color: ${Colors.lightBoxShadowGrey};
  ${!APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder()};
`;

export const PickerFieldContainerForAndroid = styled(View)`
  padding-horizontal: 15px;
  padding-vertical: 15px;
  background-color: ${Colors.white};
  border-color: ${Colors.lightBoxShadowGrey};
  ${!APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder()};
`;

export const DependentContainer = styled(View)<{ marginBottom?: number }>`
  padding-left: ${Metrics.doubleBaseMargin};
  padding-right: ${Metrics.baseMargin - 2};
  padding-bottom: ${Metrics.baseMargin + 2};
  background-color: ${Colors.white};
  margin-bottom: ${(props) => propOr(0, "marginBottom")(props)};
  border-color: ${Colors.lightBoxShadowGrey};
  ${!APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: Metrics.baseMargin })};
  ${APP_CONSTANTS.IS_ANDROID && AddElementShadow()};
`;

export const UploadWrapper = styled((props) => <View {...props} />)`
  min-height: ${(props) => propOr(62, "height", props)};
  flex-direction: row;
`;

export const ImageWrapper = styled(TouchableOpacity)`
  height: 82;
  width: 82;
  margin-right: 25;
  justify-content: center;
  align-items: center;
  border-radius: 4;
  background-color: ${Colors.dimGrey};
`;

export const ReceiptNameContainer = styled(View)`
  height: 80;
  margin-top: ${APP_CONSTANTS.IS_ANDROID ? 8 : 5};
`;

export const ReceiptField = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 5;
`;

export const CollapsedText = styled(TouchableOpacity)`
  padding-top: ${Metrics.baseMargin};
`;

export const DialogBodyContainer = styled(View)`
  background-color: ${Colors.charcoalGrey};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  border-bottom-left-radius: ${Metrics.baseMargin};
  border-bottom-right-radius: ${Metrics.baseMargin};
  padding-bottom: ${Metrics.doubleBaseMargin};
  padding-top: ${Metrics.smallMargin};
`;

export const PostTaxCaregoryWrapper = styled(View)`
  height: 52;
  width: 100%;
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ClaimBtnWrapper = styled(View)`
  align-items: center;
  padding-bottom: ${Metrics.baseMargin};
  margin-top: 50;
`;
// DependentsPicker styles
export const DependentsPickerWrapper = styled(View)`
  height: 52;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 15;
  display: flex;
  flex-direction: row;
  padding-top: 4;
`;

export const PostTaxPickerWrapper = styled(View)`
  height: 52;
  width: 100%;
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 4;
`;

export const PickerIconContainer = styled(View)`
  padding-right: ${APP_CONSTANTS.IS_ANDROID ? 4 : 0};
`;
