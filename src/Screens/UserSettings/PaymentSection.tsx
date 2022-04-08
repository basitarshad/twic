import * as React from "react";
import { View } from "react-native";
import { If } from "react-if";
import { Divider } from "react-native-elements";
import { propOr, pathOr } from "ramda";
import { Metrics, Colors, Fonts } from "Themes";
import { AppText, AppHeading } from "Components";
import { getPointsToAmount, getPriceString, isEmptyOrNil } from "Utils";
import styled from "styled-components";
import { useSelector } from "react-redux";

export type PaymentSectionRowContainerType = {
  marginTop?: number;
};
export const PaymentSectionRowContainer = styled(View)<PaymentSectionRowContainerType>`
  margin-top: ${(props) => propOr(0, "marginTop")(props)};
  justify-content: space-between;
  flex-direction: row;
  padding-vertical: ${Metrics.smallMargin};
`;
export const PaymentSection = (props) => {
  const { type, payment, name, last4, userCountry = "us", salesTax = 0 } = props;
  const stipendConfig = useSelector((state) => pathOr({}, ["userProfile", "stipendConfig"], state));
  // const countryCurrency = findCountryCurrencyCode(userCountry);
  const { totalPayment = 0, paymentOutOfPocket = 0, employeeWalletsUsed = [], pointsUsed = 0 } = payment;
  const walletNames = employeeWalletsUsed.map((wallet) => wallet.walletTypeId.charAt(0).toUpperCase() + wallet.walletTypeId.slice(1));
  const walletAmounts = employeeWalletsUsed.map((wallet) => wallet.amount);
  const names = `(${walletNames.join(", ")})`;
  const amount = walletAmounts.reduce((a, b) => a + b, 0);
  const isWalletTransaction = type === "walletTransaction";

  const UsePointsOrWalletsName = !isEmptyOrNil(pointsUsed) ? "Points Used" : `Use Account Balance ${names}`;
  const showCardDetails = !isEmptyOrNil(last4) ? `Card ending in **** ${last4}` : "Your Payment";
  const actualPrice = totalPayment - salesTax;
  return (
    <View style={{ paddingTop: Metrics.doubleBaseMargin * 2 }}>
      <If condition={!isEmptyOrNil(actualPrice)}>
        <PaymentSectionRowContainer marginTop={Metrics.baseMargin}>
          <AppText width={Metrics.screenWidth / 1.45} ellipsizeMode="tail" numberOfLines={2}>
            {name}
          </AppText>
          <AppText>{actualPrice ? getPriceString({ price: actualPrice, country: userCountry, displayAsAmount: true }) : "—"}</AppText>
        </PaymentSectionRowContainer>
        <Divider
          style={{
            backgroundColor: Colors.lightGrey,
            marginVertical: Metrics.smallMargin,
            height: 1,
          }}
        />
      </If>
      <PaymentSectionRowContainer marginTop={Metrics.baseMargin}>
        <AppHeading>Total</AppHeading>
        <AppHeading fontSize={Fonts.size.small}>{getPriceString({ price: totalPayment, country: userCountry, displayAsAmount: true })}</AppHeading>
      </PaymentSectionRowContainer>
      <PaymentSectionRowContainer marginTop={Metrics.baseMargin}>
        <AppText fontSize={Fonts.size.medium} width={Metrics.screenWidth / 1.45} ellipsizeMode="tail" numberOfLines={2}>
          {UsePointsOrWalletsName}
        </AppText>
        <AppText fontSize={Fonts.size.small}>{getPriceString({ price: isWalletTransaction ? getPointsToAmount({ points: pointsUsed, stipendConfig }) : amount, country: userCountry, displayAsAmount: true })}</AppText>
      </PaymentSectionRowContainer>
      <AppText paddingTop={Metrics.doubleBaseMargin} fontSize={Fonts.size.extraSmall + 2} color={Colors.secondaryText}>
        We will always apply your account balance first. Any residual balance will be charged to your default payment method.
      </AppText>
      <Divider
        style={{
          backgroundColor: Colors.lightGrey,
          height: 1,
          marginVertical: Metrics.doubleBaseMargin,
        }}
      />
      <PaymentSectionRowContainer>
        <AppHeading fontSize={Fonts.size.small}>{showCardDetails}</AppHeading>
        <AppHeading fontSize={Fonts.size.small} color={Colors.black}>
          {getPriceString({ price: paymentOutOfPocket, country: userCountry, displayAsAmount: true })}
        </AppHeading>
      </PaymentSectionRowContainer>
    </View>
  );
};
