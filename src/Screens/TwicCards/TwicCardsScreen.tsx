import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Else, If, Then } from "react-if";
import { pathOr, propOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";

import { AppScreenTitle, AppText, IconWithText } from "Components";
import { Colors, Metrics } from "Themes";
import { fetchOrUpdateCardholderInfo } from "Actions";
import { PlusCircleSvgIcon } from "Components/SvgIcons";
import { isEmptyOrNil } from "Utils";
import { NavigationService } from "Services";
import { AmplitudeAnalytics } from "AppAnalytics";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_ROUTES } from "../../Navigation";

import { CardsSettingsScreen, ManageCardsScreen } from ".";
import { TwicCardType, UserProfileDataType, UserEmployeeSettingsType } from "types";
import { PHYSICAL, VIRTUAL } from "./Components/constants";
import { TwicCardTabs } from "./StyledComponents";

const MANAGE_CARD = "Manage Cards";
const CARD_SETTINGS = "Cards Settings";
const PHYSICAL_CARD_TEXT = "Add Debit Card";
const VIRTUAL_CARD_TEXT = "Add Virtual Card";

const TwicCardsScreen = () => {
  const [state, setState] = React.useState<{
    selectedTab: string;
  }>({
    selectedTab: MANAGE_CARD,
  });

  const { selectedTab } = state;
  const activeTabStyle = {
    paddingBottom: Metrics.baseMargin,
    borderBottomWidth: 3,
    borderBottomColor: Colors.black,
  };

  const userProfile: UserProfileDataType = useSelector((state) => propOr({}, "userProfile", state));
  const userInfo: UserEmployeeSettingsType = propOr({}, "userInfo", userProfile);
  const twicCards: TwicCardType[] = pathOr([], ["userTwicCard", "twicCards"], userProfile);
  const { stripeCardHolderExists } = userInfo;
  const virtualTwicCard = twicCards.find((card: TwicCardType) => card.type === VIRTUAL);
  const physicalTwicCard = twicCards.find((card: TwicCardType) => card.type === PHYSICAL);
  const findAddCardText = () => {
    if (!isEmptyOrNil(virtualTwicCard) && isEmptyOrNil(physicalTwicCard)) return PHYSICAL_CARD_TEXT;
    if (isEmptyOrNil(virtualTwicCard) && !isEmptyOrNil(physicalTwicCard)) return VIRTUAL_CARD_TEXT;
    return "";
  };
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getCardholderInfo = async () => {
      dispatch(fetchOrUpdateCardholderInfo({}));
    };

    if (stripeCardHolderExists) getCardholderInfo();
  }, []);

  React.useEffect(() => {
    // LOG TWIC CARD VIEW TO AMPLITUDE
    dispatch(AmplitudeAnalytics.twicCardsView());
  }, []);
  return (
    <ScreenWrapper newDesignSystem>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppScreenTitle>Forma Card</AppScreenTitle>
        <If condition={twicCards.length === 1}>
          <IconWithText
            textStyle={{
              color: Colors.newBlue,
              paddingTop: 0,
              fontWeight: "700",
            }}
            iconStyle={{ height: Metrics.icons.extraSmall + 3, width: Metrics.icons.extraSmall + 3, justifyContent: "center" }}
            RenderSvgIcon={() => <PlusCircleSvgIcon fillColor={Colors.newBlue} />}
            useCustomIcon
            useSvgIcon
            text={findAddCardText()}
            onLinkPress={() => {
              const cardText = findAddCardText();
              const cardType = cardText === PHYSICAL_CARD_TEXT ? PHYSICAL : VIRTUAL;
              NavigationService.navigate(APP_ROUTES.CREATE_TWIC_CARD, { cardType });
            }}
            testId="add-twic-card-button"
          />
        </If>
      </View>
      <TwicCardTabs>
        <TouchableOpacity onPress={() => setState({ ...state, selectedTab: MANAGE_CARD })} style={selectedTab === MANAGE_CARD ? activeTabStyle : {}}>
          <AppText fontWeight={"bold"} color={selectedTab === MANAGE_CARD ? Colors.black : Colors.placeholderColor} testID="manage-cards" accessibilityLabel="manage-cards">
            {MANAGE_CARD}
          </AppText>
        </TouchableOpacity>
        <If condition={stripeCardHolderExists}>
          <TouchableOpacity onPress={() => setState({ ...state, selectedTab: CARD_SETTINGS })} style={selectedTab === CARD_SETTINGS ? { ...activeTabStyle, marginLeft: Metrics.doubleBaseMargin } : { marginLeft: Metrics.doubleBaseMargin }}>
            <AppText fontWeight={"bold"} color={selectedTab === CARD_SETTINGS ? Colors.black : Colors.placeholderColor} testID="card-settings" accessibilityLabel="card-settings">
              {CARD_SETTINGS}
            </AppText>
          </TouchableOpacity>
        </If>
      </TwicCardTabs>
      <If condition={selectedTab === MANAGE_CARD}>
        <Then>
          <ManageCardsScreen />
        </Then>
        <Else>
          <CardsSettingsScreen />
        </Else>
      </If>
    </ScreenWrapper>
  );
};

export default TwicCardsScreen;
