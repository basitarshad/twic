import * as React from "react";
import { pathOr, propOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";

import { TwicCardType, UserProfileDataType } from "types";
import { isEmptyOrNil } from "Utils/helpers";
import { updateTwicCardStatus, replaceTwicCard } from "Actions/user.actions";

import { TwicCardsCarousel } from "./Components/TwicCardsCarousel";

const TwicCardsDetailScreen = () => {
  const userProfile: UserProfileDataType = useSelector((state) => propOr({}, "userProfile", state));

  const twicCards: TwicCardType[] = pathOr([], ["userTwicCard", "twicCards"], userProfile);
  const dispatch = useDispatch();

  const onReplaceVirtualTwicCard = (selectedCardId: string) => {
    const payload = {
      shipping_address: {},
    };
    if (!isEmptyOrNil(selectedCardId)) dispatch(replaceTwicCard({ id: selectedCardId, payload }));
  };

  const onDeleteTwicCard = (selectedCardId: string) => {
    const payload = {
      status: "canceled",
    };
    if (!isEmptyOrNil(selectedCardId)) dispatch(updateTwicCardStatus({ id: selectedCardId, payload }, "Card has been deleted successfully"));
  };

  const onTwicCardStatusChange = (selectedCardId: string, status: string, successMessage: string) => {
    const payload = {
      status,
    };
    if (!isEmptyOrNil(selectedCardId)) dispatch(updateTwicCardStatus({ id: selectedCardId, payload }, successMessage));
  };

  return <TwicCardsCarousel cards={twicCards} onTwicCardStatusChange={onTwicCardStatusChange} onReplaceVirtualTwicCard={onReplaceVirtualTwicCard} onDeleteTwicCard={onDeleteTwicCard} />;
};

export default TwicCardsDetailScreen;
