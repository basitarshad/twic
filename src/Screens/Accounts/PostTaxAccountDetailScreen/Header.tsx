import * as React from "react";
import { If } from "react-if";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { View } from "react-native";
import { Divider } from "react-native-elements";

import { AppScreenTitle, AppText, TooltipView, RowContainer, IconWithText } from "Components";
import { Colors, Fonts, Images, Metrics } from "Themes";
import { FAQSvgIcon } from "Components/SvgIcons";
import { TwicCardType, WalletCardProps } from "types";
import { getPriceString, ignoreCaseSensitivityAndReplaceWord, isEmptyOrNil } from "Utils";
import { getAccountImage } from "../metadata";
import { ViewTwicCard } from "../ViewTwicCard";
import { NewClaimButton } from "../NewClaimButton";
import { AccountLogoAndTitle } from "../AccountLogoAndTitle";
import { TextWrapper } from "./StyledComponents";

const actionButtonWidth = Metrics.screenWidth / 2 - 22;
type HeaderProps = any;

export const Header = (props: HeaderProps) => {
  const { accountDetails } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const { name, amount, renewedAmount, nextCreditDate, renewFrequency } = accountDetails;
  const formatName = ignoreCaseSensitivityAndReplaceWord(name, " wallet", "");
  const { description, walletId, walletTypeId, isTwicCardPaymentAllowed } = accountDetails as WalletCardProps;
  const accountIcon = getAccountImage.get(walletTypeId) || Images.commuter;

  const twicCards: TwicCardType[] = useSelector((state) => pathOr([], ["userProfile", "userTwicCard", "twicCards"], state));
  const isVirtualCardAvailable = twicCards.find((card: TwicCardType) => card.type === "virtual") || {};

  const twicCardPayment = !isEmptyOrNil(isVirtualCardAvailable) && isTwicCardPaymentAllowed ? true : false;
  const tooltipText = renewFrequency ? "When you will receive funds to your account balance." : "";
  const tooltipLabel = renewFrequency === "never" ? "Lifetime Renewal" : `Renews ${nextCreditDate && nextCreditDate}`;

  return (
    <>
      <AccountLogoAndTitle name={formatName} imageSrc={accountIcon} description={description} />
      <Divider style={{ backgroundColor: Colors.lightGrey, height: 1, marginTop: 20, marginBottom: 10 }} />
      <RowContainer marginVertical={15}>
        <View>
          <AppScreenTitle color={Colors.newCharcoalDarkGrey} style={{ height: 30 }}>
            {getPriceString({ price: amount, country: userCountry })}
          </AppScreenTitle>
          <TextWrapper>
            <AppText color={Colors.charcoalLightGrey}>Available Balance</AppText>
          </TextWrapper>
        </View>
        <View style={{ display: "flex", marginLeft: 15 }}>
          <AppText fontSize={Fonts.size.h1 - 1} color={Colors.newCharcoalDarkGrey} style={{ height: 30 }}>
            {getPriceString({ price: renewedAmount, country: userCountry })}
          </AppText>
          <RowContainer marginVertical={0} alignItems={"center"} style={{ height: 30 }}>
            <AppText color={Colors.charcoalLightGrey}>{tooltipLabel}</AppText>
            <If condition={!isEmptyOrNil(tooltipText)}>
              <TooltipView value={tooltipText} height={100} pointerColor={Colors.newCharcoalDarkGrey} containerStyle={{ backgroundColor: Colors.newCharcoalDarkGrey, height: 90 }} popOverTextColor="white">
                <IconWithText iconStyle={{ marginHorizontal: nextCreditDate ? 4 : 1 }} textStyle={{ width: 0 }} icon={Images.faqIcon} iconSize="tiny" useSvgIcon RenderSvgIcon={() => <FAQSvgIcon fillColor={Colors.newBlue} />} isDisabled={true} />
              </TooltipView>
            </If>
          </RowContainer>
        </View>
      </RowContainer>
      <RowContainer justifyContent="space-between" style={{ marginRight: 2 }}>
        <If condition={!isEmptyOrNil(walletId)}>
          <NewClaimButton buttonWidth={actionButtonWidth} accountId={walletId} accountType={"posttax"} />
        </If>
        <If condition={twicCardPayment}>
          <ViewTwicCard buttonWidth={actionButtonWidth} />
        </If>
      </RowContainer>
    </>
  );
};
