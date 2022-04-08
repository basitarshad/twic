import * as React from "react";
import { View } from "react-native";
import { If } from "react-if";

import { AppText, AppHeading, IconWithText } from "Components";
import { Metrics, Fonts } from "Themes";
import { getTransactionAndSubscriptionStatus, isEmptyOrNil } from "Utils";
import { APP_CONSTANTS } from "Constants";
import { OrderAndTransactionType } from "types";
import { HowToAccessSection } from "Screens/UserSettings/HowToAccessSection";
import { ContactSupport } from "Screens/UserSettings/ContactSupport";
import { PaymentSection } from "Screens/UserSettings/PaymentSection";

export const WalletTransactionDetails = (props: { last4Digits: string; userCountry: string; type: string; details: OrderAndTransactionType }) => {
  const { last4Digits, userCountry, type, details } = props;

  const { id = "", name = "", payment = [], howToAccess = [], status = "", last4 = null, salesTax = 0 } = details || {};

  const isCancelled = status === "cancelled";
  const isActive = status === "active";
  const transactionStatus = getTransactionAndSubscriptionStatus(isCancelled, status);
  const topMargin = isActive ? -3 : 0;

  return (
      <View style={{paddingHorizontal: Metrics.newScreenHorizontalPadding, paddingBottom: Metrics.baseMargin}}>
        <AppHeading fontSize={Fonts.size.h1} textTransform="capitalize" ellipsizeMode="tail" numberOfLines={2} paddingRight={Metrics.smallMargin} width={Metrics.screenWidth / 1.3}>
          {name}
        </AppHeading>

        <View
          style={{
            paddingTop: Metrics.doubleBaseMargin,
          }}
        >
          <If condition={!isEmptyOrNil(id)}>
            <AppText fontSize={Fonts.size.medium} ellipsizeMode="tail" numberOfLines={2} paddingRight={Metrics.smallMargin} width={Metrics.screenWidth / 1.3}>
              Order #{id}
            </AppText>
          </If>
        </View>

        <If condition={!isEmptyOrNil(status)}>
          <View style={{ marginTop: Metrics.doubleBaseMargin }}>
            <IconWithText
              textStyle={{
                fontFamily: "TTCommons-Regular",
                bottom: 1,
                fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.regular : Fonts.size.medium,
                color: transactionStatus.color,
              }}
              icon={transactionStatus.icon}
              useCustomIcon
              isDisabled={true}
              iconSize={isCancelled ? "extraTiny" : "small"}
              iconStyle={{ marginLeft: 0, marginTop: topMargin }}
              text={transactionStatus.name}
            />
          </View>
        </If>

        <If condition={!isEmptyOrNil(howToAccess)}>
          <HowToAccessSection howToAccess={howToAccess} />
        </If>

        <If condition={!isEmptyOrNil(id)}>
          <View style={{ marginTop: Metrics.doubleBaseMargin * 2 }}>
            <ContactSupport id={id} />
          </View>
        </If>

        <If condition={!isEmptyOrNil(payment)}>
          <PaymentSection type={type} payment={payment} salesTax={salesTax} specialPrice={""} last4Digits={last4Digits} name={name} last4={last4} userCountry={userCountry} />
        </If>
      </View>
  );
};
