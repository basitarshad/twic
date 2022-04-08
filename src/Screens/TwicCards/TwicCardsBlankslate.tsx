import * as React from "react";
import { View } from "react-native";
import { PrimaryButton } from "twic_mobile_components";

import { NavigationService } from "Services";
import { Colors, Metrics } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { AppText } from "Components/Commons";
import { CardsBlankSlate, PlusCircleSvgIcon } from "Components/SvgIcons";
import { APP_ROUTES } from "../../Navigation";
import { TwicCardsBlankSlateContainer } from "./StyledComponents";

const TwicCardsBlankSlate = () => {
  return (
    <TwicCardsBlankSlateContainer>
      <CardsBlankSlate />
      <AppText paddingTop={Metrics.doubleBaseMargin + Metrics.baseMargin} paddingBottom={Metrics.doubleBaseMargin + Metrics.baseMargin} color={Colors.placeholderColor}>
        Start using your employee benefits online right away with a virtual card, or anywhere Visa debit cards are accepted.
      </AppText>
      <PrimaryButton
        onClickHandler={() => NavigationService.navigate(APP_ROUTES.INITIAL_TWIC_CARDS_CREATE_SCREEN)}
        buttonColor={Colors.newBlue}
        labelStyle={{
          marginLeft: Metrics.baseMargin,
        }}
        width={APP_CONSTANTS.MUI_BTN_WIDTH}
        buttonLabel="Add Card"
        shadowOptions={{
          width: "0%",
        }}
        customIcon={() => (
          <View style={{ marginTop: 2 }}>
            <PlusCircleSvgIcon fillColor={Colors.white} />
          </View>
        )}
        testId="add-twic-card-button"
      />
    </TwicCardsBlankSlateContainer>
  );
};

export default TwicCardsBlankSlate;
