import { View } from "react-native";
import styled from "styled-components";
import { has, propOr } from "ramda";

import { Metrics } from "Themes/index";
import Colors from "Themes/Colors";
import { PastPaymentsSectionContainerProps, WalletTransactionTileSectionProps, TileSectionProps } from "./types";

export const PastPaymentsSectionHeadingContainer = styled(View)`
  flex-direction: row;
  padding-bottom: ${Metrics.smallMargin};
`;

export const PastPaymentsSectionContainer = styled(View)<PastPaymentsSectionContainerProps>`
  flex: 1;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : "flex-start")};
  align-items: ${(props) => props.alignItems};
`;

export const WalletTransactionTileContainer = styled(View)`
  padding-vertical: 12.5px;
  display: flex;
  justify-content: center;
`;

export const WalletTransactionRow = styled(View)<WalletTransactionTileSectionProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(props) => (has("justifyContent", props) ? `justify-content: ${props.justifyContent}` : "")}
`;

export const SectionListHeaderContainer = styled(View)`
  background-color: ${Colors.grey};
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  padding-vertical: ${Metrics.baseMargin - 2};
`;

export const TransactionCardTileContainer = styled(View)`
  padding-vertical: ${Metrics.baseMargin};
`;

export const TransactionCardTileSection = styled(View)<TileSectionProps>`
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")};
  align-items: ${(props) => propOr("flex-start", "alignItems", props)};
`;
