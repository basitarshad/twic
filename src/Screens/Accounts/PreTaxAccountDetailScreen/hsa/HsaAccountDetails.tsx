import * as React from "react";
import { Clipboard, TouchableOpacity, View, Image } from "react-native";
import { pathOr } from "ramda";

import { AppText, AppHeading, AppScreenTitle, AppDrawer } from "Components";
import { Colors, Metrics, Fonts, Images } from "Themes";
import { isEmptyOrNil } from "Utils";
import { ContentSectionContainer, HsaAccountCardContainer, HsaAccountCardHeaderContainer, ShowMoreButton } from "./StyledComponents";
import { HsaAccountDetailsType } from "./types";
import SimpleToast from "react-native-simple-toast";
import { APP_CONSTANTS } from "Constants";
const { IS_ANDROID } = APP_CONSTANTS;
const FONT_WEIGHT = "bold";
const FONT_SIZE = Fonts.size.medium;

const HsaAccountDetailsDrawer = (props: { routingNumber: string; accountNumber: string }) => {
  const { accountNumber, routingNumber } = props;

  const DisplayValue = (props: { label?: string; value: string; showIcon?: boolean }) => {
    const { label, value, showIcon = true } = props;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AppText>{value}</AppText>
        {value && showIcon && (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              Clipboard.setString(value);
              SimpleToast.show(`Copied ${label}!`);
            }}
          >
            <Image source={Images.copyToClipboard} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View
      style={{
        marginHorizontal: Metrics.newScreenHorizontalPadding,
        height: Metrics.screenHeight - 160,
      }}
    >
      <AppScreenTitle size={Fonts.size.h1} textAlign="left">
        Health Savings Account
      </AppScreenTitle>
      <AppText paddingTop={Metrics.section}>The following information is about your Health Savings Account provided to you by Forma and our banking partner Wealthcare Saver.</AppText>
      <ContentSectionContainer borderBottomWidth={1} paddingTop={Metrics.section}>
        <AppText>Routing Number</AppText>
        <DisplayValue label={"Routing No"} value={routingNumber} />
      </ContentSectionContainer>
      <ContentSectionContainer borderBottomWidth={1} paddingTop={Metrics.doubleBaseMargin}>
        <AppText>Account Number</AppText>
        <DisplayValue label={"Account No"} value={accountNumber} />
      </ContentSectionContainer>
      <ContentSectionContainer borderBottomWidth={0} paddingTop={Metrics.doubleBaseMargin}>
        <AppText>Account Type</AppText>
        {/* ACCOUNT TYPE WILL ALWAYS BE SAVINGS */}
        <DisplayValue value={"Savings"} showIcon={false} />
      </ContentSectionContainer>
    </View>
  );
};

export const HsaAccountDetails = (props: HsaAccountDetailsType) => {
  const { accountDetails, hsaAccountData } = props;
  const [state, setState] = React.useState<{ drawerVisibility: boolean }>({
    drawerVisibility: false,
  });
  const { drawerVisibility } = state;
  const { hsaRoutingNumber } = accountDetails;
  const hsaAccountNumber = pathOr("", ["account", "hsaAccountNumber"], hsaAccountData);
  const last4RoutingNumber = !isEmptyOrNil(hsaRoutingNumber) ? `*****${hsaRoutingNumber.substr(hsaRoutingNumber.length - 4)}` : "—";
  const last4HsaAccountNumber = !isEmptyOrNil(hsaAccountNumber) ? `********${hsaAccountNumber.substr(hsaAccountNumber.length - 4)}` : "—";
  return (
    <>
      <HsaAccountCardContainer>
        <HsaAccountCardHeaderContainer>
          <AppHeading fontSize={Fonts.size.h3}>Account</AppHeading>
          <ShowMoreButton onPress={() => setState({ ...state, drawerVisibility: true })}>
            <AppText color={Colors.newBlue} fontSize={FONT_SIZE} fontWeight={FONT_WEIGHT} style={{ fontFamily: "TT Commons" }}>
              Show Details
            </AppText>
          </ShowMoreButton>
        </HsaAccountCardHeaderContainer>
        <ContentSectionContainer borderBottomWidth={1} paddingTop={Metrics.doubleBaseMargin}>
          <AppText>Routing Number</AppText>
          <AppText>{last4RoutingNumber}</AppText>
        </ContentSectionContainer>
        <ContentSectionContainer borderBottomWidth={0}>
          <AppText>Account Number</AppText>
          <AppText>{last4HsaAccountNumber}</AppText>
        </ContentSectionContainer>
      </HsaAccountCardContainer>
      <AppDrawer
        showCloseIcon
        isDrawerOpen={drawerVisibility}
        onCloseHandler={() => setState({ ...state, drawerVisibility: false })}
        DrawerContent={() => <HsaAccountDetailsDrawer routingNumber={hsaRoutingNumber} accountNumber={hsaAccountNumber} />}
        drawerContainerStyle={{ paddingHorizontal: 0 }}
      />
    </>
  );
};
