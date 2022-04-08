import { APP_CONSTANTS } from "Constants";
import { pathOr, propOr } from "ramda";
import * as React from "react";
import { View } from "react-native";
import { PrimaryButton } from "twic_mobile_components";

import { AppHeading, PreTaxTwicCard, ScreenContainer } from "../../../Components";
import { TickCircleSvgIcon } from "../../../Components/SvgIcons";
import { APP_ROUTES } from "../../../Navigation";
import { NavigationService } from "../../../Services";
import { Colors, Metrics, Fonts } from "../../../Themes";
import { PreTaxCardInfoType } from "../../../types";
import { capitalizeFirstLetter } from "../../../Utils";
import {
  RequestPreTaxCardSubmissionContentConatiner,
  RequestPreTaxCardSubmissionDescriptionContainer,
  RequestPreTaxCardSubmissionIconContainer,
  RequestPreTaxCardSubmissionMiddleSectionContainer,
  RequestPreTaxCardSubmissionPageContainer,
} from "./StyledComponents";
import { RequestPreTaxCardSubmissionScreenType } from "./types";

const RequestPreTaxCardSubmissionScreen = (props: RequestPreTaxCardSubmissionScreenType) => {
  const cardInfo: PreTaxCardInfoType | {} = pathOr({}, ["route", "params", "cardInfo"], props);

  const firstName: string = pathOr("", ["cardholder", "firstName"], cardInfo);
  const lastName: string = pathOr("", ["cardholder", "lastName"], cardInfo);
  const cardLast4: string = propOr("", "cardLast4", cardInfo);
  const nameText = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;

  return (
    <ScreenContainer>
      <RequestPreTaxCardSubmissionPageContainer>
        <PreTaxTwicCard
          style={{
            containerMarginTop: Metrics.doubleBaseMargin + Metrics.baseMargin,
          }}
          cardInfo={{
            firstName,
            lastName,
            cardLast4,
          }}
        />
        <RequestPreTaxCardSubmissionContentConatiner>
          <RequestPreTaxCardSubmissionMiddleSectionContainer>
            <RequestPreTaxCardSubmissionIconContainer>
              <TickCircleSvgIcon fillColor={Colors.green} />
            </RequestPreTaxCardSubmissionIconContainer>
            <AppHeading color={Colors.charcoalLightGrey} fontSize={13} paddingBottom={Metrics.baseMargin}>
              CONGRATULATIONS!
            </AppHeading>
            <AppHeading color={Colors.black} fontSize={Fonts.size.h1} fontWeight="bold" paddingBottom={Metrics.baseMargin}>
              Your card is approved!
            </AppHeading>
            <RequestPreTaxCardSubmissionDescriptionContainer>{nameText} your card will be shipped to the cardholder in 7-10 business days.</RequestPreTaxCardSubmissionDescriptionContainer>
          </RequestPreTaxCardSubmissionMiddleSectionContainer>
          <View style={{ alignItems: "center" }}>
            <PrimaryButton
              width={APP_CONSTANTS.MUI_BTN_WIDTH}
              buttonColor={Colors.newPrimary}
              shadowOptions={{
                width: 0,
              }}
              onClickHandler={() => {
                // POP THE PREVIOUS SCREEN THAN REPLACE SCREEN SO THAT PREVIOUS SCREEN GETS CLEAN
                NavigationService.goBackToFirstScreenOfStack();
                NavigationService.navigate(APP_ROUTES.PRETAX_CARD_SCREEN);
              }}
              buttonLabel="Back to My Cards"
              testId="back-to-benefits-cards-button"
            />
          </View>
        </RequestPreTaxCardSubmissionContentConatiner>
      </RequestPreTaxCardSubmissionPageContainer>
    </ScreenContainer>
  );
};

export default RequestPreTaxCardSubmissionScreen;
