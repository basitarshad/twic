import * as React from "react";
import styled from "styled-components/native";
import { View, Text, Image } from "react-native";
import { propOr, pathOr } from "ramda";
import { useSelector } from "react-redux";
import { SecondaryButton } from "twic_mobile_components";

import APP_CONSTANTS from "Constants/AppConstants";
import NavigationService from "Services/NavigationService";
import { isEmptyOrNil } from "Utils";
import { Images, Colors, Metrics, Fonts } from "Themes";
import { NoDataPlaceHolder, TransactionSvgIcon } from "Components/SvgIcons";
import { AppHeading, AppText } from "Components/Commons";
import { ViewTwicCard } from "Screens/Accounts/ViewTwicCard";
import { TwicCardType } from "types";

import { APP_ROUTES } from "../../../Navigation";
import { useMarketplaceVendorsContext } from "../MarketplaceVendorsContext";

const NoVendorsPlaceHolderSectionContainer = styled(View)`
  background-color: #f5f5f7;
  border-radius: 7;
  padding-horizontal: ${Metrics.doubleBaseMargin};
  padding-vertical: ${Metrics.section};
  margin-bottom: ${(props) => propOr(20, "marginBottom", props)};
`;

const SectionFooter = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 20px;
`;
const buttonWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2 + Metrics.newScreenHorizontalPadding * 2);

const getDescription = (isReimbursementEnabled, isTwicCardPaymentViewEnabled) => {
  if (isReimbursementEnabled && isTwicCardPaymentViewEnabled) {
    return "The good news is that you can still use your balance to make purchases for this account. You can use your Forma card to make purchases online or in physical stores. If you’ve already made a purchase, file a claim so you can get reimbursed!";
  } else if (isReimbursementEnabled) {
    return "The good news is that you can still use your balance to make purchases for this account. If you’ve already made a purchase, file a claim so you can get reimbursed!";
  } else {
    return "The good news is that you can still use your balance to make purchases for this account. You can use your Forma card to make purchases online or in physical stores.";
  }
};
export const NoPostTaxVendorsPlaceHolderSection = () => {
  const isReimbursementEnabled = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "reimbursement"], state));
  const twicCards: TwicCardType[] = useSelector((state) => pathOr([], ["userProfile", "userTwicCard", "twicCards"], state));
  const isVirtualCardAvailable = twicCards.find((card: TwicCardType) => card.type === "virtual") || {};

  const { MarketPlaceState } = useMarketplaceVendorsContext();
  const { selectedWallet } = MarketPlaceState;
  const isTwicCardPaymentAllowed = propOr(false, "isTwicCardPaymentAllowed", selectedWallet);

  const isTwicCardPaymentViewEnabled = !isEmptyOrNil(isVirtualCardAvailable) && isTwicCardPaymentAllowed ? true : false;

  return (
    <View style={{ paddingTop: Metrics.section }}>
      <NoVendorsPlaceHolderSectionContainer>
        <SectionFooter>
          <NoDataPlaceHolder height={60} width={60} />
        </SectionFooter>
        <AppHeading fontSize={Fonts.size.h2} color={"#22222D"} fontWeight="700" style={{ lineHeight: 25 }}>
          There are no items available for this account at the moment. Check back soon!
        </AppHeading>
        <AppText marginTop={15} color="#22222D" fontWeight="400" fontSize={16} style={{ lineHeight: 24 }}>
          {getDescription(isReimbursementEnabled, isTwicCardPaymentViewEnabled)}
        </AppText>
        {isTwicCardPaymentViewEnabled && (
          <ViewTwicCard
            buttonWidth={buttonWidth}
            secondaryButtonContainerStyle={{ marginTop: 15 }}
            buttonStyle={{ borderWidth: 0 }}
            labelStyle={{ color: "white", marginLeft: 15 }}
            buttonLabel="View Forma Card"
            buttonColor={Colors.newPrimary}
            buttonShadowProps={{ width: 0 }}
            iconColor={Colors.white}
            usePrimaryButton={true}
          />
        )}
        {isReimbursementEnabled && (
          <View style={{ alignItems: "center", marginTop: 15 }}>
            <SecondaryButton
              buttonLabel="File a Claim"
              onClickHandler={() => {
                NavigationService.navigate(APP_ROUTES.NEW_REIMBURSEMENT);
              }}
              testId="file-a-claim-button"
              width={buttonWidth}
              labelStyle={{ color: Colors.newBlue, marginLeft: 15 }}
              customIcon={() => <TransactionSvgIcon fillColor={Colors.newBlue} height={22} width={22} strokeWidth={2.3} />}
            />
          </View>
        )}
      </NoVendorsPlaceHolderSectionContainer>

      <NoVendorsPlaceHolderSectionContainer>
        <View style={{ alignItems: "flex-start", justifyContent: "center" }}>
          <AppText textAlign="center" fontWeight="500" fontSize={Fonts.size.h3} paddingBottom={Metrics.doubleBaseMargin} color={"#22222D"}>
            Can’t find what you’re looking for?
          </AppText>
          <Text>
            <AppText
              color={Colors.blue}
              width="auto"
              paddingTop={2}
              onPress={() => NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: "https://twic.typeform.com/to/QjUpdaVG", backNavigation: true })}
              textAlign="left"
              fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.h4 : Fonts.size.small + 1}
            >
              Submit a request{" "}
            </AppText>
            to the Forma team and tell us what you'd love to see that's currently missing.
          </Text>
        </View>
      </NoVendorsPlaceHolderSectionContainer>
    </View>
  );
};
