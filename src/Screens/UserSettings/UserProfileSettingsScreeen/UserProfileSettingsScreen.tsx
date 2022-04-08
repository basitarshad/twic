import * as React from "react";

import BillingAddressView from "./BillingAddressView";
import Generalinfo from "./Generalinfo";
import { AppScreenTitle } from "Components";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

const UserProfileSettingsScreen = () => {
  return (
    <ScreenWrapper newDesignSystem screenContainerStyle={{ paddingTop: 0 }}>
      <AppScreenTitle>Profile</AppScreenTitle>
      <Generalinfo />
      <BillingAddressView />
    </ScreenWrapper>
  );
};

export default UserProfileSettingsScreen;
