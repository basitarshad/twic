import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { propOr } from "ramda";
import { SecondaryButton } from "twic_mobile_components";

import { AppScreenTitle, AppScreenTitleContainer, ConfirmationActionSheet, PreTaxTwicCard } from "Components";
import { deactivateBenefitCard, toggleAppScreenLoader } from "Actions";
import { SecondaryButtonContainer } from "./StyledComponents";
import { PretaxCardScreenWithDependentCardType } from "./types";
import PretaxCardScreenContent from "./PretaxCardScreenContent";
import { isEmptyOrNil } from "Utils";
import { Metrics, Colors, Fonts } from "Themes";
import { NavigationService } from "Services";
import { PreTaxCardInfoType } from "types";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_ROUTES } from "../../../Navigation";
import { CancelSvgIcon } from "Components/SvgIcons";

const benefitsCardCancelConfirmation = "The card will be cancelled and you will no longer be able to use your current card once you take this action.";

const PretaxCardScreenWithDependentCard = (props: PretaxCardScreenWithDependentCardType) => {
  const { userPreTaxAccounts, route, toggleLoader } = props;
  const refetchDependent = route.params?.refetchDependent || function () {};
  const [showBenefitsCardCancelModal, setShowBenefitsCardCancelModal] = React.useState(false);
  const card = { ...route.params.cardInfo };
  const dependent = { ...route.params.dependentInfo };

  const { firstName, lastName, address } = dependent;

  const onCardRemove = async (selectedCard: PreTaxCardInfoType) => {
    if (selectedCard) {
      toggleLoader(true);
      setShowBenefitsCardCancelModal(false);
      const cardDeactivateResponse = await deactivateBenefitCard(selectedCard.cardProxyNumber);
      if (!cardDeactivateResponse) toggleLoader(false);
      else {
        await refetchDependent();
        toggleLoader(false);
        NavigationService.navigate(APP_ROUTES.UPDATE_DEPENDENTS_SCREEN, {
          dependentInfo: dependent,
        });
      }
    }
  };

  return (
    <ScreenWrapper newDesignSystem screenContainerStyle={{ paddingTop: 0 }}>
      <AppScreenTitleContainer
        customStyle={{
          paddingHorizontal: 0,
          marginBottom: Metrics.doubleBaseMargin,
        }}
      >
        <AppScreenTitle fontWeight="bold">Benefits Card</AppScreenTitle>
      </AppScreenTitleContainer>
      <PreTaxTwicCard
        cardInfo={{
          firstName,
          lastName,
          cardLast4: !isEmptyOrNil(card) ? propOr("", "cardLast4", card) : "****",
        }}
        style={{ containerMarginTop: Metrics.baseMargin }}
      />
      <SecondaryButtonContainer
        style={{
          marginTop: Metrics.doubleBaseMargin + Metrics.doubleBaseMargin,
        }}
      >
        <View>
          <SecondaryButton
            onClickHandler={() => setShowBenefitsCardCancelModal(true)}
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
      />
      <ConfirmationActionSheet
        visible={showBenefitsCardCancelModal}
        onCancel={() => setShowBenefitsCardCancelModal(false)}
        cancelButtonLabel="No, Don't Cancel"
        title="Cancel Benefits Card"
        confirmationMessage={benefitsCardCancelConfirmation}
        options={[
          {
            label: "Cancel Card",
            onPressLabel: () => {
              setTimeout(() => {
                onCardRemove(card);
              }, 500);
            },
          },
        ]}
      />
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    userPreTaxAccounts: state.userProfile.userPreTaxAccounts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoader: (loaderVisibility: boolean) => dispatch(toggleAppScreenLoader(loaderVisibility)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PretaxCardScreenWithDependentCard);
