import * as React from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import styled from "styled-components/native";
import { AppScreenTitle, AppText } from "../../../Components";

import { Colors, Images, Metrics, Fonts } from "../../../Themes";
import { WalletCardProps } from "../../../types";
import { PaymentWalletSectionContainer, WalletSection } from "../StyledComponents";
import { AllowedPaymentWalletSectionType } from "../types";

const getAccountImage = {
  wellness: Images.wellness,
  family: Images.family,
  pet: Images.pet,
  commuter: Images.commuter,
  rewards: Images.rewards,
  communication: Images.communication,
};

const getAccountColor = {
  wellness: Colors.lightOrangeWithOpacity,
  commuter: Colors.lightGrey,
  rewards: Colors.lightOrangeWithOpacity,
  family: Colors.walletIconPurpleColor,
  pet: Colors.walletIconPurpleColor,
  communication: Colors.lightYellowish,
};

const WalletCard = (props: { accountColor: string; accountIcon: ImageSourcePropType; name: string }) => {
  const { accountColor, accountIcon, name } = props;
  return (
    <View>
      <WalletSection backgroundColor={accountColor}>
        <Image
          source={accountIcon}
          style={{
            width: 72,
            height: 72,
          }}
        />
      </WalletSection>
      <AppText numberOfLines={1} ellipsizeMode="tail" width={65} style={{ alignSelf: "center" }} color={Colors.charcoalLightGrey} size={Fonts.size.extraSmall}>
        {name}
      </AppText>
    </View>
  );
};

export const PaymentWalletSection = (props: AllowedPaymentWalletSectionType) => {
  const { paymentWallets } = props;
  return (
    <>
      <AppScreenTitle size={Fonts.size.h3}>Linked Accounts</AppScreenTitle>
      <AppText color={Colors.placeholderColor} paddingTop={Metrics.baseMargin} paddingBottom={Metrics.baseMargin}>
        Your Forma cards eligible spending is connected to these wallets.
      </AppText>
      <PaymentWalletSectionContainer>
        {paymentWallets.map((wallet: WalletCardProps) => {
          const { walletTypeId, name } = wallet;
          const accountIcon: ImageSourcePropType = getAccountImage[walletTypeId] || Images.commuter;
          const accountColor: string = getAccountColor[walletTypeId] || Colors.lightOrangeWithOpacity;
          return <WalletCard accountIcon={accountIcon} accountColor={accountColor} name={name} />;
        })}
      </PaymentWalletSectionContainer>
    </>
  );
};
