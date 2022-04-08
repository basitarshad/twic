import * as React from "react";
import styled from "styled-components";
import { View, Image, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { If, Then, Else } from "react-if";
import { propOr, pathOr } from "ramda";

import { AppText, IconWithText, AppHeading, ErrorMessage } from "Components";
import { Metrics, Fonts, Colors, Images } from "Themes";
import { isEmptyOrNil, findCountryCurrencyCode, getTransactionAndSubscriptionStatus } from "Utils";
import { APP_CONSTANTS } from "Constants";
import { NavigationService } from "Services";
import { APP_ROUTES } from "../../../Navigation";
import VendorHelpers from "Services/vendors";
import { iconStyle } from "Screens/UserSettings/SettingsList";
import { SubscriptionDetailsType, VendorDetailsType } from "types";
import { HowToAccessSection } from "../HowToAccessSection";
import { ContactSupport } from "../ContactSupport";
import { PaymentSection } from "../PaymentSection";
import { WalletTransactionHistorySection } from "../UserOrders/WalletTransactionHistorySection";
import { CancelSvgIcon } from "Components/SvgIcons";

export const SubscriptionDetailsHelperLinks = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: ${Metrics.doubleBaseMargin};
  padding-left: ${Metrics.baseMargin + 5};
  padding-right: ${Metrics.screenHorizontalPadding};
`;

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.regular : Fonts.size.normal;

export const SubscriptionDetails = (props: { last4Digits: string; userCountry: string; type: string; details: SubscriptionDetailsType; vendor: VendorDetailsType }) => {
  const { last4Digits, userCountry, type, details, vendor } = props;
  const { id = "", name = "", payment = [], status = "", productId = "", nextBillDate = "", title = "", last4 = null, amount = "", checkout = false } = details;

  const whatToExpect = pathOr("", ["what_to_expect"], vendor);
  const howToAccess = whatToExpect ? [{ instruction: whatToExpect }] : [];

  const faqs = propOr([], "faqs", vendor);
  const cancellationRefund = propOr("", "cancellation_refund", vendor);

  const specialPrice = propOr(0, "special_price", VendorHelpers.findProductFromVendor({ vendor, productId }));
  const countryCurrency = findCountryCurrencyCode(userCountry);
  const isCancelled = status === "cancelled";
  const isActive = status === "active";
  const isPendingCancel = status === "pending_cancel";
  const showCancelButton = isActive || status === "pending";
  const transactionStatus = getTransactionAndSubscriptionStatus(isCancelled, status);
  const topMargin = isActive ? -3 : 0;
  return (
    <View style={{ paddingBottom: Metrics.screenHorizontalPadding }}>
      <View style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding }}>
        <AppHeading
          testID="subscription-screen-heading"
          accessibilityLabel="subscription-screen-heading"
          fontSize={Fonts.size.h1}
          textTransform="capitalize"
          ellipsizeMode="tail"
          numberOfLines={2}
          paddingRight={Metrics.smallMargin}
          width={showCancelButton ? Metrics.screenWidth / 1.5 : Metrics.screenWidth / 1.3}
        >
          {name}
        </AppHeading>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: Metrics.doubleBaseMargin,
          }}
        >
          <IconWithText
            textStyle={{
              fontFamily: "TTCommons-Regular",
              bottom: 1,
              fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.medium : Fonts.size.medium,
              color: isCancelled ? Colors.primary : transactionStatus.color,
            }}
            icon={transactionStatus.icon}
            useCustomIcon
            useSvgIcon={isCancelled}
            RenderSvgIcon={() => <CancelSvgIcon strokeWidth={2} fillColor={Colors.primary} />}
            isDisabled={true}
            iconSize={isCancelled ? "extraTiny" : "small"}
            iconStyle={{ marginLeft: 0, marginTop: topMargin }}
            text={transactionStatus.name}
          />
        </View>

        <If condition={!isEmptyOrNil(howToAccess) && !isCancelled}>
          <HowToAccessSection howToAccess={howToAccess} />
        </If>

        <View style={{ marginTop: Metrics.doubleBaseMargin * 2 }}>
          <ContactSupport id={id} />
        </View>

        <If condition={isPendingCancel}>
          <View style={{ marginTop: Metrics.doubleBaseMargin }}>
            <ErrorMessage errorText="Your cancellation request is being processed by our support team. You will receive an email confirmation from us once the subscription is cancelled." />
          </View>
        </If>

        <View style={{ marginTop: Metrics.doubleBaseMargin * 2 }}>
          <If condition={isCancelled}>
            <Then>
              <AppText fontSize={Fonts.size.regular}>Cancelled on {nextBillDate}</AppText>
              <AppText fontSize={Fonts.size.medium} color={Colors.secondaryText}>
                Your subscription will no longer be active after {nextBillDate}
              </AppText>
            </Then>
            <Else>
              <AppText fontSize={Fonts.size.regular}>Next payment due on {nextBillDate}</AppText>
              <AppText fontSize={Fonts.size.medium} color={Colors.secondaryText}>
                {title} credits for {countryCurrency}
                {amount} per month
              </AppText>
            </Else>
          </If>
        </View>

        <If condition={!isEmptyOrNil(payment)}>
          <PaymentSection type={type} payment={payment} specialPrice={specialPrice} last4Digits={last4Digits} name={name} last4={last4} userCountry={userCountry} />
        </If>
      </View>

      <View style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding }}>
        <WalletTransactionHistorySection subscriptionId={id} />
      </View>

      <If condition={!isEmptyOrNil(faqs) && !isCancelled}>
        <Then>
          <Divider
            style={{
              backgroundColor: Colors.lightGrey,
              height: 1,
              marginTop: Metrics.doubleBaseMargin * 2,
            }}
          />

          <SubscriptionDetailsHelperLinks
            onPress={() =>
              NavigationService.navigate(APP_ROUTES.FAQS, {
                faqs: faqs,
                title: title,
              })
            }
          >
            <IconWithText
              containerStyles={{
                justifyContent: "center",
                alignItems: "center",
              }}
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                bottom: 2,
                fontSize: FONT_SIZE,
                fontWeight: FONT_WEIGHT,
                paddingTop: Metrics.smallMargin,
                textTransform: "uppercase",
              }}
              iconSize={"small"}
              icon={Images.faqIcon}
              useCustomIcon
              isDisabled={true}
              text="FAQ"
            />
            <Image source={Images.arrowRight} style={iconStyle} />
          </SubscriptionDetailsHelperLinks>

          <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
        </Then>
      </If>

      <If condition={showCancelButton}>
        <>
          <SubscriptionDetailsHelperLinks
            onPress={() =>
              NavigationService.navigate(APP_ROUTES.SUBSCRIPTIONS_CANCELLATION, {
                details,
                cancellationRefund: cancellationRefund,
                checkout,
              })
            }
          >
            <IconWithText
              containerStyles={{
                justifyContent: "center",
                alignItems: "center",
              }}
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                bottom: 2,
                fontSize: FONT_SIZE,
                fontWeight: FONT_WEIGHT,
                paddingTop: Metrics.smallMargin,
              }}
              iconSize={"small"}
              icon={Images.exclamationMarkBlack}
              useCustomIcon
              isDisabled={true}
              text="Cancellation"
            />
            <Image source={Images.arrowRight} style={iconStyle} />
          </SubscriptionDetailsHelperLinks>
          <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
        </>
      </If>
    </View>
  );
};
