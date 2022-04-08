import * as React from "react";
import { If, Then, Else } from "react-if";
import { PrimaryButton } from "twic_mobile_components";

import { AppScreenTitle, AppText, TwicCardStyled } from "../../Components";
import { APP_CONSTANTS } from "../../Constants";
import AppRoutes from "../../Navigation/AppRoutes";
import { NavigationService } from "../../Services";
import { Colors, Fonts, Metrics } from "../../Themes";
import { TwicCardConfirmationContainer, TwicScreenConfirmationSections } from "./StyledComponents";
import { TwicCardConfirmationInfoType } from "./types";

const TwicCardsConfirmation = (props) => {
  const { route } = props;
  const cardInfo: TwicCardConfirmationInfoType = route.params.cardInfo || { name: "", expMonth: "", expYear: "", cvv: "", cardNumber: "", cardType: "virtual" };
  const { name, expMonth, expYear, cvv, cardNumber, cardType } = cardInfo;
  return (
    <TwicCardConfirmationContainer>
      <TwicScreenConfirmationSections style={{ height: "60%" }}>
        <TwicCardStyled name={name} expMonth={expMonth} expYear={expYear} cvv={cvv} cardNumber={cardNumber} cardType={cardType} />
        <If condition={cardType === "virtual"}>
          <Then>
            <AppScreenTitle fontSize={28} fontWeight="bold" paddingTop={Metrics.screenHorizontalPadding} style={{ alignSelf: "center" }}>
              Your Virtual Card is here!
            </AppScreenTitle>
          </Then>
          <Else>
            <AppScreenTitle fontSize={28} fontWeight="bold" paddingTop={Metrics.screenHorizontalPadding} style={{ alignSelf: "center" }}>
              Your card is on its way!
            </AppScreenTitle>
            <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.medium : Fonts.size.regular} paddingTop={Metrics.baseMargin} color={Colors.charcoalLightGrey} style={{ alignSelf: "center" }}>
              Woohoo. Your brand-spanking-new Forma debit card will arrive within 5 - 7 business days.
            </AppText>
          </Else>
        </If>
      </TwicScreenConfirmationSections>
      <TwicScreenConfirmationSections style={{ height: "40%" }}>
        <PrimaryButton
          width={APP_CONSTANTS.MUI_BTN_WIDTH}
          shadowOptions={{
            width: "0%",
          }}
          labelStyle={{
            fontWeight: "500",
          }}
          buttonColor={Colors.newPrimary}
          onClickHandler={() => {
            NavigationService.goBackToFirstScreenOfStack(3);
            NavigationService.navigate(AppRoutes.USER_TWIC_CARD);
          }}
          buttonLabel="Manage Cards"
          testId="manage-cards-button"
        />
      </TwicScreenConfirmationSections>
    </TwicCardConfirmationContainer>
  );
};

export default TwicCardsConfirmation;
