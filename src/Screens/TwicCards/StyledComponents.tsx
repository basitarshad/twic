import { View } from "react-native";
import styled from "styled-components/native";

import { Colors, Metrics } from "../../Themes";
import { PaymentWalletSectionType } from "./types";

export const AddInitialTwicCardsContainer = styled(View)`
  margin-bottom: ${Metrics.screenHorizontalPadding};
`;

export const SectionHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Metrics.screenHorizontalPadding};
  margin-bottom: ${Metrics.baseMargin};
  align-items: center;
`;

export const GetTwicCardContainer = styled(View)`
  margin-bottom: ${Metrics.screenHorizontalPadding};
`;

export const ManageCardsScreenContainer = styled(View)`
  margin-top: ${Metrics.screenHorizontalPadding};
`;

export const TwicCardsBlankSlateContainer = styled(View)`
  align-items: center;
`;

export const TwicCardConfirmationContainer = styled(View)`
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};
  padding-vertical: ${Metrics.screenHorizontalPadding};
  background-color: ${Colors.white};
`;

export const TwicScreenConfirmationSections = styled(View)`
  justify-content: flex-end;
`;

export const TwicCardTabs = styled(View)`
  flex-direction: row;
  border-bottom-width: 1;
  border-bottom-color: ${Colors.lightGrey};
  margin-top: ${Metrics.doubleBaseMargin};
`;

export const AddressSectionHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Metrics.screenHorizontalPadding};
  margin-bottom: ${Metrics.baseMargin};
  align-items: center;
`;

// gap style is not allowed in react-native with flex-wrap
// We had to find a work around to give space between cards
export const PaymentWalletSectionContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -12px 0 0 -12px;
`;

const paymentWalletWidth = (Metrics.screenWidth - 90) / 3;
export const WalletSection = styled(View)<PaymentWalletSectionType>`
  width: ${paymentWalletWidth};
  height: ${paymentWalletWidth};
  border-radius: ${Metrics.baseMargin};
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
  margin-vertical: ${Metrics.baseMargin};
  margin: 12px 0 0 12px;
`;

export const CarouselContainer = styled(View)`
  width: 100%;
  margin-bottom: ${Metrics.baseMargin};
`;

export const TwicCardContainer = styled(View)`
  width: ${Metrics.screenWidth - 32};
  align-items: center;
`;
