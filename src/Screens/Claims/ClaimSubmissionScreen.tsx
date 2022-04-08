import * as React from "react";
import { View } from "react-native";
import { If, Then, Else } from "react-if";
import { PrimaryButton } from "twic_mobile_components";

import { AppHeading, AppText, ScreenContainer } from "../../Components";
import { Fonts, Colors, Metrics } from "../../Themes";
import { ClaimSuccessSvgIcon } from "../../Components/SvgIcons";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";

const ClaimSubmissionScreen = (props) => {
  const { route } = props;
  const type = route.params.type || "";
  const claimType = route.params.claimType || "";
  const IsPretaxClaim = claimType === "pretax";
  const navigateToNextScreen = () => {
    if (type === "account" || type === "transaction") {
      NavigationService.goBackToFirstScreenOfStack();
      NavigationService.navigate(APP_ROUTES.CLAIMS_SCREEN);
    } else NavigationService.replaceScreen(APP_ROUTES.CLAIMS_SCREEN);
  };
  return (
    <ScreenContainer paddingBottom={Metrics.doubleBaseMargin} paddingLeft={Metrics.newScreenHorizontalPadding} paddingRight={Metrics.newScreenHorizontalPadding}>
      <View style={{ flex: 3, alignItems: "center", justifyContent: "flex-end" }}>
        <ClaimSuccessSvgIcon />
        <AppHeading fontSize={Fonts.size.h1 + 4} paddingBottom={20} paddingTop={45} color={Colors.charcoalDarkGrey} textAlign={"center"}>
          Your claim has been submitted!
        </AppHeading>
        <AppText color={Colors.charcoalDarkGrey} textAlign={"center"}>
          <If condition={IsPretaxClaim}>
            <Then>Once your claim is approved, you will receive your reimbursement as a direct deposit into your bank account linked to your Forma profile. Funds typically takes 3-7 business days to arrive.</Then>
            <Else>Once it is approved, your reimbursement will be added automatically to your future paycheck (typically 3-4 weeks).</Else>
          </If>
        </AppText>
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <PrimaryButton buttonColor={Colors.newPrimary} width={Metrics.screenWidth - 32} testId="back-to-claims-list-button" buttonLabel="Got it" onClickHandler={() => navigateToNextScreen()} shadowOptions={{ width: 0 }} />
      </View>
    </ScreenContainer>
  );
};

export default ClaimSubmissionScreen;
