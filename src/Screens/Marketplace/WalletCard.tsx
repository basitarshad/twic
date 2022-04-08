import * as React from "react";
import { Image } from "react-native";
// import { NavigationContext } from "react-navigation";
import { useDispatch } from "react-redux";
import { propOr } from "ramda";

import { AppHeading, BoxShadow } from "Components/Commons";
import { Colors, Metrics, Images } from "Themes";
import { toggleAppScreenLoader } from "Actions";
import { ignoreCaseSensitivityAndReplaceWord, isEmptyOrNil } from "Utils/helpers";
import { getPriceString } from "Utils/amountCalculation.helpers";
import APP_CONSTANTS from "Constants/AppConstants";
import { getAccountColor, getAccountImage } from "Screens/Accounts/metadata";
import { AccountCardAmountContainer, AccountCardBorderContainer, AccountCardContentContainer, AccountCardSection } from "Screens/Accounts/StyledComponents";
import { useMarketplaceVendorsContext } from "./MarketplaceVendorsContext";
import { setSelectedWalletInContext } from "Services/MarketplaceVendors";
import NavigationService from "Services/NavigationService";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";

import APP_ROUTES from "../../Navigation/AppRoutes";
import { WalletCardProps } from "../../types";

export const WalletCard = ({ account, userCountry }) => {
  const dispatch = useDispatch();
  const { MarketPlaceState, MarketPlaceDispatcher } = useMarketplaceVendorsContext();
  const { selectedWallet, categoryId } = MarketPlaceState;
  const selectedWalletTypeID = propOr("", "walletTypeId", selectedWallet);
  const selectedWalletFormattedName = propOr("", "key", selectedWallet);
  // const navigation = React.useContext(NavigationContext);
  const { name, amount, walletTypeId } = account as WalletCardProps;
  const formatName = ignoreCaseSensitivityAndReplaceWord(name, " wallet", "");
  const walletIcon = getAccountImage.get(walletTypeId) || Images.commuter;
  const walletColor = getAccountColor.get(walletTypeId) || Colors.lightGrey;

  const getVendorsByWallet = async () => {
    await setSelectedWalletInContext(account, MarketPlaceDispatcher, {
      shouldComponentUpdate: true,
    });
    MarketPlaceDispatcher({
      type: "UPDATE_MARKETPLACE_CONTEXT",
      payload: {
        categoryId: "",
        preTaxAccount: undefined,
      },
    });
    MarketPlaceDispatcher({
      type: "TOGGLE_FILTER",
      payload: { isDrawerOpen: false },
    });
    setTimeout(async () => {
      await dispatch(toggleAppScreenLoader(true));
    }, 0);
    dispatch(
      AmplitudeAnalytics.storeFilterSelected({
        account: walletTypeId || "",
        category: "",
      }),
    );
    NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN_WALLET_LISTING);
  };

  const activeWallet = () => {
    return isEmptyOrNil(categoryId) && !isEmptyOrNil(selectedWalletTypeID) && selectedWalletFormattedName === name;
  };

  return (
    <BoxShadow
      shadowOptions={{
        ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
        shadowColor: Colors.black,
        shadowRadius: 5.5,
        bottom: 8,
        height: activeWallet() ? 0 : 3,
      }}
      otherOptions={{
        alignSelf: "center",
      }}
      shadowContainerStyle={{
        alignItems: "stretch",
        marginVertical: Metrics.smallMargin,
        backgroundColor: Colors.white,
        borderColor: Colors.blue,
        borderWidth: activeWallet() ? 2 : 0,
        borderRadius: Metrics.baseMargin,
      }}
      onPress={() => getVendorsByWallet()}
      contentWrapperStyle={{
        borderRadius: Metrics.baseMargin,
      }}
    >
      <AccountCardBorderContainer
        borderColor={activeWallet() ? Colors.white : Colors.lightBoxShadowGrey}
        style={{
          paddingHorizontal: Metrics.baseMargin,
          height: 60,
        }}
      >
        <AccountCardContentContainer>
          <AccountCardSection flex={2} alignItems="center">
            <Image
              source={walletIcon}
              style={{
                height: Metrics.images.medium,
                width: Metrics.images.medium,
              }}
            />
          </AccountCardSection>
          <AccountCardSection flex={4.3}>
            <AppHeading textTransform="capitalize" ellipsizeMode="tail" numberOfLines={1} paddingTop={0} testID={formatName} accessibilityLabel={formatName}>
              {formatName}
            </AppHeading>
          </AccountCardSection>
          <AccountCardSection flex={3.7} alignItems="flex-end">
            <AccountCardAmountContainer backgroundColor={walletColor}>
              <AppHeading paddingTop={0}>{getPriceString({ price: amount, country: userCountry })}</AppHeading>
            </AccountCardAmountContainer>
          </AccountCardSection>
        </AccountCardContentContainer>
      </AccountCardBorderContainer>
    </BoxShadow>
  );
};
