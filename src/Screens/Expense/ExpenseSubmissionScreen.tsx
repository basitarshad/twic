import * as React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { SecondaryButton } from "twic_mobile_components";

import { AppHeading, AppText, ScreenContainer } from "../../Components";
import { Fonts, Colors, Metrics } from "../../Themes";
import { ClaimSuccessSvgIcon } from "../../Components/SvgIcons";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { APP_CONSTANTS } from "../../Constants";
import { PretaxAccountsType } from "../../types";

const ExpenseSubmissionScreen = (props) => {
  const { route } = props;
  const walletId = route.params.walletId || "";
  const pretaxAccounts: PretaxAccountsType[] = useSelector((state) => pathOr([], ["userProfile", "userPreTaxAccounts"], state));
  const walletDetails = pretaxAccounts.find((account: PretaxAccountsType) => account.flexAccountId === walletId);
  return (
    <ScreenContainer>
      <View style={{ flex: 1, padding: Metrics.newScreenHorizontalPadding }}>
        <View style={{ flex: 1.5, alignItems: "center", justifyContent: "flex-end" }}>
          <ClaimSuccessSvgIcon />
          <AppHeading fontSize={Fonts.size.h1 + 4} paddingBottom={20} paddingTop={45} color={Colors.charcoalDarkGrey} textAlign={"center"}>
            You added a new expense!
          </AppHeading>
          <AppText color={Colors.charcoalDarkGrey} textAlign={"center"}>
            Your expense has been created and added in your HSA account, and placed in your queue.
          </AppText>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <SecondaryButton
            buttonLabel="Back to HSA"
            onClickHandler={() => {
              NavigationService.goBackToFirstScreenOfStack();
              NavigationService.navigate(APP_ROUTES.PRETAX_ACCOUNT_DETAIL_SCREEN, { accountDetails: walletDetails });
            }}
            labelStyle={{ color: Colors.newBlue, tetxAlign: "center" }}
            width={APP_CONSTANTS.MUI_BTN_WIDTH}
            testId="back-to-hsa-button"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default ExpenseSubmissionScreen;
