import React from "react";
import { pathOr } from "ramda";
import { useSelector } from "react-redux";
import { TwicCardType, WalletCardProps } from "types";
import { isEmptyOrNil } from "Utils";

export const useTwicCards = () => {
  const userProfile = useSelector((state) => pathOr({}, ["userProfile"], state));
  const twicCards: TwicCardType[] = pathOr([], ["userTwicCard", "twicCards"], userProfile);
  const wallets: WalletCardProps[] = pathOr([], ["userInfo", "wallets"], userProfile);
  const allowedPaymentWallets: WalletCardProps[] = wallets.filter((wallet: WalletCardProps) => wallet.isTwicCardPaymentAllowed);
  const availableVirtualCards = twicCards.find((card: TwicCardType) => card.type === "virtual") || {};

  const isTwicCardPaymentEnabled = !isEmptyOrNil(availableVirtualCards) && !isEmptyOrNil(allowedPaymentWallets) ? true : false;

  return { isTwicCardPaymentEnabled, hasAllowedPaymentWallets: allowedPaymentWallets.length > 0, allowedPaymentWallets, availableVirtualCards };
};
