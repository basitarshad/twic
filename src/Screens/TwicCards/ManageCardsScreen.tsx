import * as React from "react";
import { pathOr, propOr } from "ramda";
import { useSelector } from "react-redux";
import { Else, If, Then } from "react-if";
import { Divider } from "react-native-elements";

import { Colors, Metrics } from "Themes";
import { TwicCardType, WalletCardProps, UserProfileDataType } from "types";
import { isEmptyOrNil } from "Utils";

import { TwicCardsBlankSlate, TwicCardsDetailScreen } from ".";
import { ManageCardsScreenContainer } from "./StyledComponents";
import { PaymentWalletSection } from "./Components/PaymentWalletSection";

const ManageCardsScreen = () => {
  const userProfile: UserProfileDataType = useSelector((state) => propOr({}, "userProfile", state));
  const twicCards: TwicCardType[] = pathOr([], ["userTwicCard", "twicCards"], userProfile);
  const wallets: WalletCardProps[] = pathOr([], ["userInfo", "wallets"], userProfile);
  const allowedPaymentWallets: WalletCardProps[] = wallets.filter((wallet: WalletCardProps) => wallet.isTwicCardPaymentAllowed);
  return (
    <>
      <ManageCardsScreenContainer testID="manage-cards-tab" accessibilityLabel="manage-cards-tab">
        <If condition={isEmptyOrNil(twicCards)}>
          <Then>
            <TwicCardsBlankSlate />
          </Then>
          <Else>
            <TwicCardsDetailScreen />
          </Else>
        </If>
        <Divider style={{ backgroundColor: Colors.dimGrey, height: 1, marginVertical: Metrics.screenHorizontalPadding }} />
        <PaymentWalletSection paymentWallets={allowedPaymentWallets} />
      </ManageCardsScreenContainer>
    </>
  );
};
export default ManageCardsScreen;
