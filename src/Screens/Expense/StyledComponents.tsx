import { propOr } from "ramda";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { APP_CONSTANTS } from "../../Constants";
import { Colors, Metrics } from "../../Themes";

export const ReceiptNameContainer = styled(View)`
  height: 80;
  margin-top: ${APP_CONSTANTS.IS_ANDROID ? 8 : 5};
`;

export const ImageWrapper = styled(TouchableOpacity)`
  height: 80px;
  width: 80px;
  margin-right: 25px;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  background-color: ${Colors.charcoalGrey};
  border-width: 1;
  border-color: ${Colors.lightBoxShadowGrey};
`;

export const ReceiptField = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-top: 5;
`;

export const UploadWrapper = styled(View)`
  height: ${(props) => propOr(80, "height", props)};
  flex-direction: row;
`;

export const NewExpenseScreenContainer = styled(View)`
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
`;

export const EmptyTwicCardsContainer = styled(View)`
  align-items: center;
  margin-top: ${Metrics.doubleSection};
`;

export const ExpenseDetailsContainer = styled(View)`
  padding-vertical: ${Metrics.baseMargin + 3};
`;

export const ExpenseDetailsHorizontalScrollSectionStyle = styled(View)`
  padding-left: 20;
  border-left-width: 1;
  border-left-color: ${Colors.dimGrey};
  justify-content: flex-end;
`;
