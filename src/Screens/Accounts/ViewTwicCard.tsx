import * as React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import AppConstants from "Constants/AppConstants";
import { AppDrawer, AppText, TwicCardStyled } from "../../Components/Commons";
import { Metrics, Fonts, Colors } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { CreditCardSvg, MaximizeBenefits, ReceiptsSvgIcon } from "../../Components/SvgIcons";
import { APP_CONSTANTS } from "Constants";
import { TwicCardType } from "../../types";
import { DrawerContentContainerStyle, SecondaryButtonContainerStyle, CardDetailsWrapper } from "./StyledComponents";
import { TwicCardDetailsType, ViewTwicCardType } from "./types";
import styled from "styled-components/native";

const IconContainer = styled.View`
  margin-top: ${APP_CONSTANTS.IS_ANDROID ? 4 : 0};
`;

const DrawerContent = (props: { title: string; description: string; icon: JSX.Element }) => {
  const { title, description, icon } = props;
  return (
    <DrawerContentContainerStyle>
      <View style={{ flex: 0.75 }}>{icon}</View>
      <View style={{ flex: 2.25 }}>
        <AppText fontSize={Fonts.size.h3} style={{ fontWeight: "500", fontFamily: "TTCommons-DemiBold" }} paddingBottom={Metrics.baseMargin}>
          {title}
        </AppText>
        <AppText style={{ fontWeight: "300" }} color={Colors.charcoalLightGrey}>
          {description}
        </AppText>
      </View>
    </DrawerContentContainerStyle>
  );
};

const TwicCardDetailsDrawer = (props: TwicCardDetailsType) => {
  const { card, onCloseHandler } = props;
  const {
    cardholder: { name = "" },
    expMonth = 0,
    expYear = 0,
    cvc = "",
    number = "",
    type = "",
    status = "",
  } = card;
  const buttonWidth = Metrics.screenWidth - Metrics.doubleBaseMargin * 2 - 4;

  return (
    <View
      style={{
        marginTop: Metrics.baseMargin,
        marginBottom: APP_CONSTANTS.IS_ANDROID ? Metrics.baseMargin : Metrics.doubleBaseMargin,
      }}
    >
      <TwicCardStyled name={name} expMonth={expMonth} expYear={expYear} cvv={cvc} cardNumber={number} cardType={type} status={status} TwicCardContainerCustomStyle={{ width: Metrics.screenWidth - Metrics.doubleBaseMargin * 2 }} />
      <DrawerContent icon={<ReceiptsSvgIcon />} title="No More receipts" description="Eligible expenses are automatically approved and there’s no need to file a claim" />
      <DrawerContent icon={<MaximizeBenefits />} title="Maximize your benefits" description="Link your bank account and spend beyond your card balance for bigger purchases. Never get stuck with unused balances" />
      <View style={{ marginTop: Metrics.section, marginBottom: APP_CONSTANTS.IS_ANDROID ? 10 : 0, alignSelf: "center" }}>
        <SecondaryButtonContainerStyle style={{ width: buttonWidth }}>
          <SecondaryButton
            buttonLabel="Card Settings"
            onClickHandler={() => {
              onCloseHandler();
              setTimeout(() => {
                NavigationService.navigate(APP_ROUTES.USER_TWIC_CARD);
              }, 500);
            }}
            testId="card-settings-button"
            width={AppConstants.MUI_BTN_WIDTH - 10}
            labelStyle={{ color: Colors.newBlue, marginLeft: 10 }}
            customIcon={() => <CreditCardSvg />}
          />
        </SecondaryButtonContainerStyle>
      </View>
    </View>
  );
};

export const ViewTwicCard = (props: ViewTwicCardType) => {
  const { buttonWidth, secondaryButtonContainerStyle = {}, buttonLabel = "View Card", labelStyle = { color: Colors.newBlue, marginLeft: 15 }, buttonColor = Colors.white, iconColor = Colors.newBlue, usePrimaryButton = false } = props;
  const twicCards: TwicCardType[] = useSelector((state) => pathOr([], ["userProfile", "userTwicCard", "twicCards"], state));
  const firstCard = twicCards.find((card) => card.type === "virtual");
  const [state, setState] = React.useState<{ drawerVisibility: boolean }>({
    drawerVisibility: false,
  });
  const { drawerVisibility } = state;

  const Button = usePrimaryButton ? PrimaryButton : SecondaryButton;

  return (
    <View>
      <SecondaryButtonContainerStyle style={{ width: buttonWidth, ...secondaryButtonContainerStyle }}>
        <Button
          buttonColor={buttonColor}
          buttonLabel={buttonLabel}
          onClickHandler={() => setState({ ...state, drawerVisibility: true })}
          testId="accounts-view-twic-card-button"
          width={buttonWidth}
          labelStyle={labelStyle}
          customIcon={() => (
            <IconContainer>
              <CreditCardSvg fillColor={iconColor} />
            </IconContainer>
          )}
        />
      </SecondaryButtonContainerStyle>
      <AppDrawer
        isDrawerOpen={drawerVisibility && !isEmptyOrNil(firstCard)}
        onCloseHandler={() => setState({ ...state, drawerVisibility: false })}
        DrawerContent={() => (
          <CardDetailsWrapper>
            <TwicCardDetailsDrawer card={firstCard} onCloseHandler={() => setState({ ...state, drawerVisibility: false })} />
          </CardDetailsWrapper>
        )}
        drawerContainerStyle={{ paddingBottom: Metrics.baseMargin }}
        drawerContentContainerStyle={{ alignItems: "stretch" }}
      />
    </View>
  );
};
