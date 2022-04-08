import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, TouchableOpacity, Platform } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { If, Then, Else } from "react-if";
import { head } from "ramda";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import { Colors, Metrics } from "../../../Themes";
import { TwicCardType } from "../../../types";
import { AppScreenTitle, AppText, ConfirmationActionSheet, TwicCardStyled } from "../../../Components";
import { APP_CONSTANTS } from "../../../Constants";
import { NavigationService } from "../../../Services";
import AppRoutes from "../../../Navigation/AppRoutes";
import { CardLockSvgIcon, SyncSvgIcon, UnlockSvgIcon } from "../../../Components/SvgIcons";
import { VIRTUAL, PHYSICAL, ACTIVE, IN_ACTIVE } from "./constants";
import { CarouselContainer, TwicCardContainer } from "../StyledComponents";
import { TwicCardCarouselType } from "../types";

// NOTE:  CAROUSEL DOES NOT RE-RENDER ON SWIPE, SO TO GET UPDATED DATA WE ARE KEEPING IT IN STATE
export const TwicCardsCarousel = (props: TwicCardCarouselType) => {
  const { cards, onReplaceVirtualTwicCard, onDeleteTwicCard, onTwicCardStatusChange } = props;
  const firstCard: TwicCardType = head(cards);
  const [state, setState] = React.useState<{
    deleteModalVisible: boolean;
    replaceVirtualCardModalVisible: boolean;
    selectedCard: TwicCardType;
    cardIndex: number;
  }>({
    deleteModalVisible: false,
    replaceVirtualCardModalVisible: false,
    selectedCard: firstCard,
    cardIndex: 0,
  });
  const swiperRef = React.useRef<any>(null);

  const { selectedCard, deleteModalVisible, cardIndex, replaceVirtualCardModalVisible } = state;
  const { type: cardType, id, last4 } = selectedCard;

  React.useEffect(() => {
    const previouslySelectedCard = cards.find((card: TwicCardType) => card.id === selectedCard.id) || firstCard;
    // IF CARD IS DELETED PAGINATION VALUE SET TO 0
    const paginationIndex = cards.length === 1 ? 0 : cardIndex;
    setState({ ...state, selectedCard: previouslySelectedCard, cardIndex: paginationIndex });
  }, [cards]);

  const deleteTwicCard = () => {
    onDeleteTwicCard(id);
    swiperRef && swiperRef.current.snapToPrev();
  };
  const replaceVirtualTwicCard = () => onReplaceVirtualTwicCard(id);

  const confirmationModalTitle = selectedCard && cardType === VIRTUAL ? "Cancel Virtual card" : "Cancel Debit Card";

  const createConfirmationText = (sectionOneText: string, sectionTwoText: string) => (
    <>
      <AppText paddingLeft={Metrics.baseMargin} paddingRight={Metrics.baseMargin} style={{ color: Colors.placeholderColor }}>
        {sectionOneText}
      </AppText>
      <AppText paddingLeft={Metrics.baseMargin} paddingRight={Metrics.baseMargin} paddingTop={Metrics.baseMargin} style={{ color: Colors.placeholderColor }}>
        {sectionTwoText}
      </AppText>
    </>
  );

  const LockUnlockSection = (props: { cardStatus: string; type: string }) => {
    const { cardStatus, type = "" } = props;
    const isActive = cardStatus === ACTIVE;
    const activationMessage = isActive ? "Card has been locked successfully!" : "Card has been unlocked successfully";
    return (
      <View style={{ width: "100%", marginVertical: Metrics.baseMargin }}>
        <If condition={isActive}>
          <Then>
            <SecondaryButton
              buttonLabel="Lock Card"
              customIcon={() => (
                <View>
                  <CardLockSvgIcon fillColor={Colors.newBlue} />
                </View>
              )}
              shadowOptions={{
                width: "0%",
                height: "0%",
              }}
              width={APP_CONSTANTS.MUI_BTN_WIDTH}
              onClickHandler={() => onTwicCardStatusChange(id, isActive ? IN_ACTIVE : ACTIVE, activationMessage)}
              testId={`lock-${type}-card`}
            />
          </Then>
          <Else>
            <PrimaryButton
              width={APP_CONSTANTS.MUI_BTN_WIDTH}
              buttonColor={Colors.newPrimary}
              shadowOptions={{
                width: "0%",
                height: "0%",
              }}
              buttonLabel="Unlock Card"
              customIcon={() => (
                <View style={{ marginRight: Metrics.baseMargin + 6 }}>
                  <UnlockSvgIcon />
                </View>
              )}
              testId={`unlock-${type}-card`}
              onClickHandler={() => onTwicCardStatusChange(id, isActive ? IN_ACTIVE : ACTIVE, activationMessage)}
            />
          </Else>
        </If>
      </View>
    );
  };

  const ReplaceTwicCardSection = (props: { type: string }) => {
    const { type } = props;
    return (
      <View style={{ width: "100%", paddingBottom: 20 }}>
        <SecondaryButton
          labelStyle={{ color: Colors.newBlue, marginLeft: 20 }}
          buttonLabel="Replace"
          customIcon={() => (
            <View>
              <SyncSvgIcon fillColor={Colors.newBlue} />
            </View>
          )}
          width={APP_CONSTANTS.MUI_BTN_WIDTH}
          onClickHandler={() => {
            if (type === VIRTUAL) {
              setState({ ...state, replaceVirtualCardModalVisible: true });
            } else NavigationService.navigate(AppRoutes.REPLACE_PHYSICAL_TWIC_CARD_SCREEN, { id });
          }}
          buttonStyle={{ borderColor: Colors.newDimGrey, borderWidth: 1 }}
          testId={`replace-${type}-card`}
        />
      </View>
    );
  };

  const deleteModalConfirmationMsg = createConfirmationText(
    "The card will be cancelled and permanently terminated. You will no longer be able to use it once you take this action.",
    `Proceed with the cancellation of your ${cardType === VIRTUAL ? "virtual" : "debit"} card ending in ${last4}?`,
  );

  const replaceVirtualCardModalConfirmationMsg = createConfirmationText(
    "To continue, please confirm that you want to replace your virtual card.",
    "Your existing virtual card will be permanently cancelled and deleted from your account. It can no longer be in use.",
  );

  const _renderItem = ({ item }: { item: TwicCardType }) => {
    const { last4: cardLast4, type, status } = item;
    return (
      <TwicCardContainer>
        <TwicCardStyled name={item.cardholder.name} expMonth={item.expMonth} expYear={item.expYear} cvv={item.cvc} cardNumber={item.number} cardType={item.type} status={item.status} />
        <View style={{ marginVertical: Metrics.doubleBaseMargin, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <If condition={type === PHYSICAL}>
            <Then>
              <AppScreenTitle>Debit Card ********{cardLast4}</AppScreenTitle>
            </Then>
            <Else>
              <AppScreenTitle>Virtual Card</AppScreenTitle>
            </Else>
          </If>
          <TouchableOpacity onPress={() => setState({ ...state, deleteModalVisible: true })} testID={`delete-${type}-card`} accessibilityLabel={Platform.OS === "android" ? `delete-${type}-card` : undefined}>
            <Icon name="trash-o" style={{ fontSize: 23, color: Colors.primary }} />
          </TouchableOpacity>
        </View>
        <If condition={type === PHYSICAL}>
          <Then>
            <AppText paddingBottom={Metrics.baseMargin} width="100%" color={Colors.charcoalLightGrey}>
              Spend your Forma wallet balance on eligible purchase, anywhere debit is accepted.
            </AppText>
          </Then>
          <Else>
            <AppText paddingBottom={Metrics.baseMargin} width="100%" color={Colors.charcoalLightGrey}>
              No wait, no hassle. Spend on eligible purchases online right away.
            </AppText>
          </Else>
        </If>
        <LockUnlockSection cardStatus={status} type={type} />
        <ReplaceTwicCardSection type={type} />
      </TwicCardContainer>
    );
  };

  return (
    <>
      <CarouselContainer>
        <Carousel
          ref={swiperRef}
          removeClippedSubviews={false}
          firstItem={0}
          initialScrollIndex={0}
          onSnapToItem={(index) => {
            const card = cards.find((_: TwicCardType, i: number) => i === index);
            card && setState({ ...state, selectedCard: card, cardIndex: index });
          }}
          data={cards}
          renderItem={_renderItem}
          sliderWidth={Metrics.screenWidth - 32}
          itemWidth={Metrics.screenWidth - 32}
          layout="default"
          inactiveSlideScale={0.5}
          inactiveSlideOpacity={0.1}
          pagingEnabled
        />
        <Pagination
          dotsLength={cards.length}
          activeDotIndex={cardIndex}
          containerStyle={{ backgroundColor: "transparent", marginTop: 0, position: "absolute", bottom: -50, alignItems: "center", alignSelf: "center" }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: Colors.black,
          }}
          inactiveDotStyle={{
            backgroundColor: Colors.lightGrey,
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </CarouselContainer>

      {/* DELETE TWIC CARD CONFIRMATION MODAL */}
      <ConfirmationActionSheet
        visible={deleteModalVisible}
        onCancel={() => setState({ ...state, deleteModalVisible: false })}
        cancelButtonLabel="Nevermind"
        title={confirmationModalTitle}
        confirmationMessage={deleteModalConfirmationMsg}
        options={[
          {
            label: `Cancel ${cardType === PHYSICAL ? "Debit" : "Virtual"} card`,
            onPressLabel: () => {
              setTimeout(() => {
                deleteTwicCard();
              }, 500);
            },
          },
        ]}
      />

      {/* REPLACE VIRTUAL TWIC CARD CONFIRMATION MODAL */}
      <ConfirmationActionSheet
        visible={replaceVirtualCardModalVisible}
        onCancel={() => setState({ ...state, replaceVirtualCardModalVisible: false })}
        cancelButtonLabel="Nevermind"
        title="Replace virtual card"
        confirmationMessage={replaceVirtualCardModalConfirmationMsg}
        options={[
          {
            label: "Replace card",
            onPressLabel: () => {
              setTimeout(() => {
                replaceVirtualTwicCard();
              }, 500);
            },
          },
        ]}
      />
    </>
  );
};
