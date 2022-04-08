import * as React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { pathOr, propOr } from "ramda";

import { Colors, Metrics, Fonts } from "Themes";
import { isEmptyOrNil, formatPreTaxAccounts } from "Utils";
import { NavigationService } from "Services";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";
import { WalletCard } from "Screens/Marketplace/WalletCard";
import CategoryCard from "Screens/Marketplace/CategoryCard";
import { useAccountsHook } from "Screens/Marketplace/useAccountsHook";
import { AppHeading, AppSectionHeader, RenderListBlankslate } from "Components/Commons";

import APP_ROUTES from "../../../../../Navigation/AppRoutes";
import { useMarketplaceVendorsContext } from "../../../MarketplaceVendorsContext";
import { PreTaxWalletCard } from "../../../PreTaxWalletCard";
import { toggleStatusBarTheme } from "../../../../../Hooks";

const Container = styled(View)`
  padding-horizontal: ${Metrics.screenHorizontalPadding};
`;

const AccountsAndCategoriesFiltersWrapper = styled(View)`
  padding-bottom: ${Metrics.baseMargin};
  width: ${Metrics.screenWidth};
`;

const AccountWalletsList = ({ postTaxWallets, preTaxWallets, hideCategories, userCountry }) => {
  return (
    <>
      <View style={{ marginBottom: Metrics.baseMargin }}>
        <AppSectionHeader
          title="Accounts"
          titleStyle={{
            fontWeight: "500",
            fontSize: Fonts.size.medium,
            alignSelf: "center",
            color: Colors.charcoalLightGrey,
          }}
        />
      </View>

      <FlatList
        listKey="WalletCard"
        data={postTaxWallets}
        renderItem={({ item }) => <WalletCard account={item} userCountry={userCountry} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `_${index}`}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        listKey="PreTaxWalletCard"
        data={preTaxWallets}
        renderItem={({ item }) => <PreTaxWalletCard account={item} userCountry={userCountry} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `_${index}`}
        showsHorizontalScrollIndicator={false}
      />
      {!hideCategories && (
        <View style={{ marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin }}>
          <AppSectionHeader
            title="Categories"
            titleStyle={{
              fontWeight: "500",
              fontSize: Fonts.size.medium,
              alignSelf: "center",
              color: Colors.charcoalLightGrey,
            }}
          />
        </View>
      )}
    </>
  );
};

const AccountsAndCategoriesFilters = () => {
  const dispatch = useDispatch();
  const { MarketPlaceDispatcher, MarketPlaceState } = useMarketplaceVendorsContext();
  const showMarketplace = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const { selectedWallet, categoryId, categoriesFilterList, preTaxAccount } = MarketPlaceState;
  const selectedWalletName = propOr("", "name", selectedWallet);

  const { isPostTaxAccount, isPreTaxAccount, preTaxWallets, postTaxWallets, isFSAStoreEnabled } = useAccountsHook();

  const isOnlyPreTaxAccount = isPreTaxAccount && !isPostTaxAccount;
  const formattedPreTaxAccounts = formatPreTaxAccounts(preTaxWallets.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)));

  const hideCategories = isOnlyPreTaxAccount || (isFSAStoreEnabled && !showMarketplace) || isEmptyOrNil(categoriesFilterList);
  const postTaxWallets_ = isFSAStoreEnabled && !showMarketplace ? [] : postTaxWallets.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

  const resetMarketPlaceContext = () => {
    if (!isEmptyOrNil(selectedWalletName) || !isEmptyOrNil(categoryId) || !isEmptyOrNil(preTaxAccount)) {
      MarketPlaceDispatcher({
        type: "UPDATE_MARKETPLACE_CONTEXT",
        payload: {
          selectedWallet: {},
          categoryId: "",
          isDrawerOpen: false,
          preTaxAccount: undefined,
        },
      });
      dispatch(
        AmplitudeAnalytics.storeFilterSelected({
          account: "",
          category: "",
        }),
      );
      NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN);
    } else {
      MarketPlaceDispatcher({
        type: "UPDATE_MARKETPLACE_CONTEXT",
        payload: {
          isDrawerOpen: false,
        },
      });
    }
  };

  return (
    <AccountsAndCategoriesFiltersWrapper>
      <View style={{ width: "100%", paddingHorizontal: Metrics.screenHorizontalPadding, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
        <AppHeading paddingTop={0} fontSize={Fonts.size.h1}>
          Browse By
        </AppHeading>
        <TouchableOpacity
          onPress={() => {
            toggleStatusBarTheme("light");
            resetMarketPlaceContext();
          }}
        >
          <AppHeading paddingRight={10} paddingTop={0} color={Colors.blue} fontSize={Fonts.size.h4} testID="clear-all-button" accessibilityLabel="clear-all-button">
            Clear All
          </AppHeading>
        </TouchableOpacity>
      </View>

      <Divider
        style={{
          backgroundColor: Colors.darkGrey,
          marginVertical: Metrics.doubleBaseMargin,
        }}
      />

      <Container style={{ maxHeight: Metrics.screenHeight - Metrics.screenWidth / 2 }}>
        <FlatList
          ListHeaderComponent={() => AccountWalletsList({ postTaxWallets: postTaxWallets_, preTaxWallets: formattedPreTaxAccounts, hideCategories, userCountry })}
          ListEmptyComponent={hideCategories ? null : <RenderListBlankslate />}
          contentContainerStyle={{ paddingHorizontal: 2 }}
          showsVerticalScrollIndicator={false}
          data={hideCategories ? [] : categoriesFilterList}
          renderItem={({ item }) => (
            <CategoryCard
              backNavigation={false}
              category={item}
              textOverImage={{
                required: true,
              }}
            />
          )}
          keyExtractor={(item, index) => `${item.title}_${index}`}
        />
      </Container>
    </AccountsAndCategoriesFiltersWrapper>
  );
};

export default AccountsAndCategoriesFilters;
