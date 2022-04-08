import * as React from "react";
import styled from "styled-components/native";

import { Metrics } from "../../Themes";
import { AppText } from "../../Components/Commons/AppStyledComponents";
import { APP_CONSTANTS } from "../../Constants";

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";

// product title container
export const TitleContainer = styled.View`
  padding-bottom: ${Metrics.doubleBaseMargin};
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
`;

// section components || Common Styles Between Checkout Module Components
export const SectionContainer = styled.View`
  padding-bottom: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
`;

export const SectionTitle = styled(AppText)`
  font-weight: ${FONT_WEIGHT};
  font-family: TTCommons-DemiBold;
  padding-bottom: ${Metrics.baseMargin};
`;

export const RowContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-vertical: 8;
`;

//CheckoutDetailsSection Components
export const WalletDetailsContainer = styled.View`
  flex: 3.5;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
