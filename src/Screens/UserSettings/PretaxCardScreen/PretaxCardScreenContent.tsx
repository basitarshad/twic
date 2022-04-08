import * as React from "react";
import { If } from "react-if";
import { Clipboard, Image, View } from "react-native";
import Toast from "react-native-simple-toast";
import { ScrollView } from "react-native-gesture-handler";

import { AppHeading, IconWithText } from "Components";
import { ArrowRightSvgIcon, ClipboardSvgIcon } from "Components/SvgIcons";
import { APP_CONSTANTS } from "Constants";
import { Fonts, Metrics, Colors } from "Themes";
import { createAddressString, findCountryCurrencyCode, findCountryName, isEmptyOrNil, truncate } from "Utils";
import { PretaxAccountsType } from "types";

import { AddressStyle, CopyViewContainer, ArrowContainer, CardStyle } from "./StyledComponents";

type PretaxCardScreenContentType = {
  dependentInfo: {
    firstName: string;
    lastName: string;
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      state: string;
      zip: string;
    };
  };
  userPreTaxAccounts: PretaxAccountsType[];
  appHeadingMarginTop?: number;
  userCountry?: string;
};

const PretaxCardScreenContent = (props: PretaxCardScreenContentType) => {
  const { dependentInfo, userPreTaxAccounts = [], appHeadingMarginTop = Metrics.doubleBaseMargin + Metrics.doubleBaseMargin, userCountry = "us" } = props;
  const { firstName, lastName, address } = dependentInfo;
  const { line1, line2, city, zip, country, state: countryState } = address;
  const addressWithFullCountry = {
    ...address,
    country: findCountryName(address.country),
  };
  const currencyCode = findCountryCurrencyCode(userCountry);
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);
  const [xScrollPosition, setXScrollPosition] = React.useState(0);
  const scrollRef = React.useRef(null);
  const scrollToEnd = () => {
    if (scrollRef.current) {
      //@ts-ignore
      scrollRef.current.scrollToEnd();
    }
  };
  return (
    <>
      <AppHeading fontSize={Fonts.size.h4} textTransform="none" paddingTop={appHeadingMarginTop} paddingBottom={Metrics.doubleBaseMargin} fontWeight="bold">
        Billing Address for {`${firstName} ${lastName}`}
      </AppHeading>
      <View>
        {!isEmptyOrNil(line1) && <AddressStyle>{line1}</AddressStyle>}
        {!isEmptyOrNil(line2) && <AddressStyle>{line2}</AddressStyle>}
        {!isEmptyOrNil(city) && <AddressStyle>{`${city}, ${countryState}`}</AddressStyle>}
        {!isEmptyOrNil(zip) && <AddressStyle>{zip}</AddressStyle>}
        {!isEmptyOrNil(country) && <AddressStyle>{findCountryName(country)}</AddressStyle>}
      </View>
      <CopyViewContainer>
        <IconWithText
          useSvgIcon
          RenderSvgIcon={() => <ClipboardSvgIcon fillColor={Colors.newBlue}/>}
          text="Copy "
          textStyle={{
            fontFamily: "TTCommons-DemiBold",
            width: "auto",
            fontWeight: APP_CONSTANTS.IS_ANDROID ? "400" : "bold",
            color: Colors.newBlue,
            fontSize: Fonts.size.h4,
          }}
          iconStyle={{
            marginLeft: 0,
            marginRight: Metrics.smallMargin,
          }}
          onLinkPress={() => {
            Clipboard.setString(createAddressString(addressWithFullCountry, ["line1", "line2", "city", "state", "zip", "country"]));
            Toast.show("Street Address Copied!");
          }}
          testId="copy-address"
        />
      </CopyViewContainer>
      <AppHeading fontSize={Fonts.size.h4} textTransform="capitalize" paddingTop={Metrics.screenHorizontalPadding} paddingBottom={Metrics.doubleBaseMargin} fontWeight="bold">
        Card is linked to
      </AppHeading>
      <View>
        <ScrollView
          onContentSizeChange={(width, _) => setShowScrollBtn(width > Metrics.screenWidth - Metrics.screenHorizontalPadding * 2)}
          onScroll={(e) => setXScrollPosition(e.nativeEvent.contentOffset.x)}
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: 60, marginBottom: 20 }}
        >
          {userPreTaxAccounts.map((card: any, index: number) => {
            const { name, amount } = card;
            return (
              <CardStyle count={index}>
                <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey}>
                  {currencyCode}
                  {amount}
                </AppHeading>
                <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                  {truncate(name, 19, "...")}
                </AppHeading>
              </CardStyle>
            );
          })}
        </ScrollView>
        <If condition={xScrollPosition < 20 && showScrollBtn}>
          <ArrowContainer onPress={scrollToEnd}>
            <ArrowRightSvgIcon />
          </ArrowContainer>
        </If>
      </View>
    </>
  );
};

export default PretaxCardScreenContent;
