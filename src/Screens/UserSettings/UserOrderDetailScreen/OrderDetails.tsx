import * as React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { If, Then } from "react-if";
import { propOr, pathOr } from "ramda";
import styled from "styled-components/native";

import { AppText, IconWithText, AppHeading } from "Components";
import { Metrics, Fonts, Colors, Images } from "Themes";
import { isEmptyOrNil } from "Utils";
import { APP_CONSTANTS } from "Constants";
import { NavigationService } from "Services";
import { iconStyle } from "Screens/UserSettings/SettingsList";
import { OrderAndTransactionType, VendorDetailsType } from "types";
import { APP_ROUTES } from "../../../Navigation";
import { HowToAccessSection } from "../HowToAccessSection";
import { ContactSupport } from "../ContactSupport";
import { PaymentSection } from "../PaymentSection";

export const OrderDetailsHelperLinks = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: ${Metrics.doubleBaseMargin};
  padding-left: ${Metrics.baseMargin + 5};
  padding-right: ${Metrics.screenHorizontalPadding};
`;
const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.regular : Fonts.size.normal;

const getActiveSinceDate = (data) => {
  const { createdAt } = data;
  return `Purchased on ${createdAt}`;
};
type OrderDetailsType = { last4Digits: string; userCountry: string; type: string; details: OrderAndTransactionType; vendor: VendorDetailsType; salesTax: number };
export const OrderDetails = (props: OrderDetailsType) => {
  const { last4Digits, userCountry, type, details, vendor, salesTax } = props;
  const { id = "", name = "", payment = [], status = "", last4 = null } = details;
  const howToAccess = pathOr([], ["hta"], vendor);
  const faqs = propOr([], "faqs", vendor);
  const isCancelled = status === "cancelled";
  const isActive = status === "active";
  const showCancelButton = isActive || status === "pending";
  return (
    <View style={{ paddingBottom: Metrics.screenHorizontalPadding }}>
      <View style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding }}>
        <AppHeading
          testID="order-screen-heading"
          accessibilityLabel="order-screen-heading"
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
          <If condition={!isEmptyOrNil(id)}>
            <AppText fontSize={Fonts.size.medium} ellipsizeMode="tail" numberOfLines={2} paddingRight={Metrics.smallMargin} width={Metrics.screenWidth / 1.3}>
              Order #{id}
            </AppText>
          </If>
        </View>

        <AppText paddingTop={Metrics.smallMargin} fontSize={Fonts.size.medium}>
          {getActiveSinceDate(details)}
        </AppText>

        <If condition={!isEmptyOrNil(howToAccess) && !isCancelled}>
          <HowToAccessSection howToAccess={howToAccess} />
        </If>

        <View style={{ marginTop: Metrics.doubleBaseMargin * 2 }}>
          <ContactSupport id={id} />
        </View>

        <If condition={!isEmptyOrNil(payment)}>
          <PaymentSection salesTax={salesTax} type={type} payment={payment} last4Digits={last4Digits} name={name} last4={last4} userCountry={userCountry} />
        </If>
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

          <OrderDetailsHelperLinks
            onPress={() =>
              NavigationService.navigate(APP_ROUTES.FAQS, {
                faqs: faqs,
                title: name,
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
          </OrderDetailsHelperLinks>

          <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
        </Then>
      </If>
    </View>
  );
};
