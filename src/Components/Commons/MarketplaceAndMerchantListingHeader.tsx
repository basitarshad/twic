import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { pathOr, propOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";

// import { NavigationContext } from "react-navigation";

import { AppHeading, AppScreenTitle, RowContainer, IconWithBadge, AppHeader } from "Components/Commons";
import { FilterSvgIcon } from "Components/SvgIcons";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import APP_CONSTANTS from "Constants/AppConstants";
import { getAccountColor } from "Screens/Accounts/metadata";
import { isEmptyOrNil } from "Utils/helpers";
import { getPriceString } from "Utils/amountCalculation.helpers";
import { WalletCardProps } from "types";
import { useMarketplaceVendorsContext } from "Screens/Marketplace/MarketplaceVendorsContext";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";

const shadow = {
  shadowColor: Colors.darkGrey,
  shadowOffset: { width: 0, height: APP_CONSTANTS.IS_ANDROID ? 8 : 6 },
  shadowOpacity: APP_CONSTANTS.IS_ANDROID ? 0.46 : 0.2,
  shadowRadius: APP_CONSTANTS.IS_ANDROID ? 12 : 5,
  elevation: 17,
  //background color added for android only to show shadow
  backgroundColor: Colors.white,
  zIndex: 10000,
};

const headerContainerStyles = { paddingHorizontal: Metrics.newScreenHorizontalPadding, paddingTop: Metrics.baseMargin, paddingBottom: Metrics.baseMargin, justifyContent: "flex-start" };

type WalletAmountTextContainerProps = {
  backgroundColor: string;
};
const WalletAmountTextContainer = styled((props) => <View {...props} />)<WalletAmountTextContainerProps>`
  padding-horizontal: ${Metrics.screenHorizontalPadding / 2};
  padding-vertical: ${Metrics.smallMargin};
  border-radius: ${Metrics.smallMargin};
  background-color: ${(props) => propOr(Colors.lightOrange, "backgroundColor", props)};
  justify-content: center;
`;

const TitleComponent = (props) => {
  const { walletDetails } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const { name = "", amount = 0, walletTypeId = "" } = walletDetails;
  const title = !isEmptyOrNil(name) ? name : "Store";
  const walletColor = getAccountColor.get(walletTypeId) || Colors.lightGrey;
  return (
    <View style={{ flexDirection: "row" }}>
      <AppScreenTitle size={30} textTransform="capitalize" paddingRight={Metrics.baseMargin} ellipsizeMode="tail" numberOfLines={1} width={Metrics.screenWidth / 3} testID="merchant-screen-header" accessibilityLabel="merchant-screen-header">
        {title}
      </AppScreenTitle>
      <WalletAmountTextContainer backgroundColor={walletColor}>
        <AppHeading paddingTop={0}>{getPriceString({ price: amount, country: userCountry })}</AppHeading>
      </WalletAmountTextContainer>
    </View>
  );
};

const FilterMenuButton = () => {
  const dispatch = useDispatch();
  // const navigation = React.useContext(NavigationContext);
  const { MarketPlaceDispatcher } = useMarketplaceVendorsContext();

  const openDrawer = () => {
    MarketPlaceDispatcher({
      type: "TOGGLE_FILTER",
      payload: { isDrawerOpen: true },
    });

    // LOG STORE FILTER VIEW TO AMPLITUDE
    dispatch(AmplitudeAnalytics.storeFilterView());
  };

  return (
    <TouchableOpacity style={{ marginTop: Metrics.screenHorizontalPadding / 2 }} onPress={() => openDrawer()} testID={"filter-menu"} accessibilityLabel={"filter-menu"}>
      <RowContainer marginVertical={0}>
        <IconWithBadge iconStyle={{ marginRight: 10, marginLeft: Metrics.baseMargin }} useSvgIcon RenderSvgIcon={() => <FilterSvgIcon height={25} width={25} fillColor={Colors.darkGrey} />} />
      </RowContainer>
    </TouchableOpacity>
  );
};

type MarketplaceAndMerchantListingHeaderType = {
  title: string | undefined;
  walletDetails?: object;
  showFilterMenu?: boolean;
  showShadow?: boolean;
  showBackButton?: boolean;
};

const MarketplaceAndMerchantListingHeader = (props: MarketplaceAndMerchantListingHeaderType) => {
  const { walletDetails = {}, title, showFilterMenu = true, showShadow = false, showBackButton = false } = props;
  const { walletTypeId = "" } = walletDetails as WalletCardProps;
  const name = !isEmptyOrNil(title) ? title : "Store";

  const MarketplaceTitle = () => {
    if (!isEmptyOrNil(walletTypeId)) return <TitleComponent walletDetails={walletDetails} />;
    return (
      <AppScreenTitle size={30} ellipsizeMode="tail" numberOfLines={1} width={showBackButton ? "78%" : "auto"} testID="merchant-screen-header" accessibilityLabel="merchant-screen-header">
        {name}
      </AppScreenTitle>
    );
  };

  const MarketplaceFilterMenu = () => {
    if (showFilterMenu) {
      return <FilterMenuButton />;
    }
    return null;
  };

  return (
    <View style={showShadow && shadow}>
      <AppHeader TitleComponent={() => <MarketplaceTitle />} showBackButton={showBackButton} testId="merchant-screen-header" SecondaryComponent={() => <MarketplaceFilterMenu />} containerStyle={headerContainerStyles} />
    </View>
  );
};

export default MarketplaceAndMerchantListingHeader;
