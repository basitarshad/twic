import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { pathOr, propOr } from "ramda";
import { If, Then } from "react-if";
import { useBackHandler } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { SecondaryButton } from "twic_mobile_components";

import NavigationService from "Services/NavigationService";
import { fetchBenefitsCardsAndSelectedDependentInfo } from "Actions/user.actions";
import { AppScreenTitle, AppScreenTitleContainer } from "Components/Commons/AppStyledComponents";
import IconWithText from "Components/Commons/IconWithText";
import { toggleAppScreenLoader } from "Actions/appLoader.actions";
import { isEmptyOrNil } from "Utils/helpers";
import Colors from "Themes/Colors";
import Fonts from "Themes/Fonts";
import Metrics from "Themes/Metrics";
import { CancelSvgIcon, PlusCircleSvgIcon } from "Components/SvgIcons";
import APP_CONSTANTS from "Constants/AppConstants";
import { getSingleDependentInfo, deactivateBenefitCard } from "Actions/index";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

import PretaxCardScreenContent from "./PretaxCardScreenContent";
import PretaxCardCarousel from "./PretaxCardCarousel";
import { APP_ROUTES } from "../../../Navigation";
import { PretaxAccountsType, PreTaxCardInfoType, UserDependentInfoType } from "../../../types";
import { SecondaryButtonContainer } from "./StyledComponents";
import { PreTaxCardScreenType } from "./types";
import { ConfirmationActionSheet } from "Components";

const benefitsCardCancelConfirmation = "The card will be cancelled and you will no longer be able to use your current card once you take this action.";
const PretaxCardScreen = (props: PreTaxCardScreenType) => {
  const { toggleLoader, navigation, userProfile } = props;
  const isFocused = useIsFocused();
  const userPreTaxAccounts: PretaxAccountsType[] = propOr([], "userPreTaxAccounts", userProfile);
  const userCountry: string = pathOr("us", ["userInfo", "country"], userProfile);
  const demographics = propOr({}, "cdhProfileDetail", userProfile);
  const [state, setState] = React.useState<{
    cards: Array<PreTaxCardInfoType>;
    dependent: UserDependentInfoType | any;
    cardInfo: PreTaxCardInfoType | any;
    cardIndex: number;
    benefitsCardCancelModal: boolean;
  }>({
    cards: [],
    dependent: {},
    cardInfo: {},
    cardIndex: 0,
    benefitsCardCancelModal: false,
  });

  const { cards, dependent, cardInfo, cardIndex, benefitsCardCancelModal } = state;
  const swiperRef = React.useRef<any>(null);

  type FetchPreTaxCardsType = {
    cardToSelect: number;
  };
  const fetchPreTaxCards = async (params: FetchPreTaxCardsType) => {
    const { cardToSelect } = params;
    const formatedCardAndDependentState = await fetchBenefitsCardsAndSelectedDependentInfo(cardToSelect, demographics);
    setState({
      ...state,
      ...formatedCardAndDependentState,
      benefitsCardCancelModal: false,
    });
    toggleLoader(false);
  };

  // Below function is for android hardware back button
  const handleBackButtonClick = () => {
    NavigationService.navigate(APP_ROUTES.USER_PROFILE);
  };

  useBackHandler(() => {
    if (isFocused) {
      handleBackButtonClick();
      return true;
    } else {
      return false;
    }
  });

  React.useEffect(() => {
    toggleLoader(true);
    fetchPreTaxCards({ cardToSelect: 0 });
    // Navigation is added to that re-direction after card request we fetch all the cards again.
  }, [navigation]);

  const onCardSwipe = async (index: number) => {
    // We are comparing through index number because we got no other way to receive
    // dependentId on swiping the card
    const updatedCard = cards.find((_: PreTaxCardInfoType, i: number) => i === index) || {};
    // MULTIPLE TIMES STATE IS SET BECAUSE WE WANT TO SHOW UPDATED CARD ON SWIPE THEN LOADER
    // IF SINGLE STATE IS CHANGED IT WILL PREVIUOS CARD FIRST THEN UPDATED CARD
    setState({
      ...state,
      cardInfo: updatedCard,
      cardIndex: index,
      benefitsCardCancelModal: false,
    });
    const dependentId: string = propOr("", "dependentId", updatedCard);
    toggleLoader(true);
    const dependentInfo = !isEmptyOrNil(dependentId) ? await getSingleDependentInfo(dependentId) : demographics;

    setState({
      ...state,
      dependent: dependentInfo,
      cardInfo: updatedCard,
      cardIndex: index,
      benefitsCardCancelModal: false,
    });
    toggleLoader(false);
  };

  const onCardRemove = async () => {
    if (cardInfo) {
      const isLastCardDeleted = cards.length - 1 === cardIndex;
      toggleLoader(true);
      const cardToSelect = isLastCardDeleted ? cardIndex - 1 : cardIndex;
      const cardDeactivateResponse = await deactivateBenefitCard(cardInfo.cardProxyNumber);
      // SPECIAL CASE FOR LAST ITEM TO DELETE BECAUSE LIBRARY HAS UNUSUAL BEHAVIOUR
      // IF LAST ELEMENT IS DELETED THEN WE SWIPE THE CARD FIRST ELSE
      // LAST CARD IS NOT SHOWN
      if (!cardDeactivateResponse) toggleLoader(false);
      else {
        if (isLastCardDeleted) {
          swiperRef && swiperRef.current.snapToPrev();
          onCardSwipe(cardIndex - 1);
        }
        fetchPreTaxCards({ cardToSelect });
      }
    }
  };
  const { firstName, lastName, address } = dependent;
  return (
    <ScreenWrapper newDesignSystem screenContainerStyle={{ paddingTop: 0 }}>
      <If condition={!isEmptyOrNil(cards)}>
        <Then>
          <AppScreenTitleContainer
            customStyle={{
              paddingHorizontal: 0,
            }}
          >
            <AppScreenTitle fontWeight="bold">Benefits Cards</AppScreenTitle>
            <IconWithText
              text="Request a Card"
              onLinkPress={() => NavigationService.navigate(APP_ROUTES.ADD_PRETAX_CARD_SCREEN)}
              useSvgIcon={true}
              RenderSvgIcon={() => (
                <View style={{ marginTop: 5 }}>
                  <PlusCircleSvgIcon fillColor={Colors.newBlue} height={24} width={24} />
                </View>
              )}
              iconColor={Colors.newBlue}
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                width: "auto",
                fontWeight: APP_CONSTANTS.IS_ANDROID ? "400" : "bold",
                color: Colors.newBlue,
                fontSize: Fonts.size.h4,
                textTransform: "none",
              }}
              iconStyle={{
                marginHorizontal: 0,
                marginRight: Metrics.smallMargin,
              }}
              containerStyles={{
                marginVertical: Metrics.baseMargin,
              }}
              testId="request-benefits-card"
            />
          </AppScreenTitleContainer>
          <PretaxCardCarousel cards={cards} onCardSwipe={onCardSwipe} cardIndex={cardIndex} swiperRef={swiperRef} />

          <SecondaryButtonContainer>
            <View>
              <SecondaryButton
                onClickHandler={() => setState({ ...state, benefitsCardCancelModal: true })}
                buttonLabel="Cancel Card"
                customIcon={() => (
                  <View style={{ paddingRight: 10 }}>
                    <CancelSvgIcon fillColor={Colors.newBlue} />
                  </View>
                )}
                labelStyle={{
                  fontWeight: "bold",
                  fontFamily: "TTCommons-DemiBold",
                  fontSize: Fonts.size.medium,
                  color: Colors.newBlue,
                }}
                width={Metrics.screenWidth / 2.5}
                buttonStyle={{ height: 30, borderRadius: 5, paddingTop: 0, paddingBottom: 0, borderColor: Colors.newDimGrey, borderWidth: 1 }}
                testId="cancel-benefits-card"
              />
            </View>
          </SecondaryButtonContainer>
          <PretaxCardScreenContent
            dependentInfo={{
              firstName,
              lastName,
              address,
            }}
            userPreTaxAccounts={userPreTaxAccounts}
            appHeadingMarginTop={Metrics.doubleBaseMargin + 5}
            userCountry={userCountry}
          />
          <ConfirmationActionSheet
            visible={benefitsCardCancelModal}
            onCancel={() => setState({ ...state, benefitsCardCancelModal: false })}
            cancelButtonLabel="No, Don't Cancel"
            title="Cancel Benefits Card"
            confirmationMessage={benefitsCardCancelConfirmation}
            options={[
              {
                label: "Cancel Card",
                onPressLabel: () => {
                  setTimeout(() => {
                    onCardRemove();
                  }, 500);
                },
              },
            ]}
          />
        </Then>
      </If>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    isLoading: state.appScreenLoader.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoader: (loaderVisibility: boolean) => dispatch(toggleAppScreenLoader(loaderVisibility)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PretaxCardScreen);
