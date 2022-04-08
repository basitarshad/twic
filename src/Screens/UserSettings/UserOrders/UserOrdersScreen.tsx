import * as React from "react";

import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { AppScreenTitle } from "Components/index";
import { Metrics } from "Themes/index";

import { WalletTransactionHistorySection } from "./WalletTransactionHistorySection";

const UserOrdersScreen = (props) => {
  return (
    <ScreenWrapper newDesignSystem scrollView={false} screenContainerStyle={{ paddingTop: 0 }}>
      <AppScreenTitle textTransform="capitalize" paddingBottom={Metrics.baseMargin}>
        Orders
      </AppScreenTitle>
      <WalletTransactionHistorySection />
    </ScreenWrapper>
  );
};

export default UserOrdersScreen;
