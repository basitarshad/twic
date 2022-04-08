import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { pathOr, inc, propOr } from "ramda";
import { FlatList, RefreshControl, View } from "react-native";
import { If } from "react-if";

import { MerchantCard } from "Components/Commons";
import { Colors, Metrics } from "Themes";
import { toggleAppScreenLoader } from "Actions";
import { fetchVendorListingsByWallet } from "Services/API/marketplaceVendors.api";
import { findCountryCurrencyCode } from "Utils/helpers";
import { WalletCardProps } from "types";
import MarketplaceAndMerchantListingHeader from "Components/Commons/MarketplaceAndMerchantListingHeader";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";
import { ListFooterComponent } from "Components/Commons/SectionLists";

import { MerchantCardListingContentProps } from "./types";
import { NoPostTaxVendorsPlaceHolderSection } from "./Components/NoPostTaxVendorsPlaceHolderSection";
import { useMarketplaceVendorsContext } from "./MarketplaceVendorsContext";
import { MarketplaceFilterDrawer } from "./Components/MarketplaceFilters/MarketplaceFilterDrawer";

const WalletListingContent = (props: MerchantCardListingContentProps) => {
  const { currentList, listOnEndReachedCallback, isPageLoading, getVendorsList, currentPage, actionsDispatch } = props;

  const onRefresh = async () => {
    actionsDispatch(toggleAppScreenLoader(true));
    await getVendorsList({ currentList, currentPage });
    actionsDispatch(toggleAppScreenLoader(false));
  };

  return (
    <FlatList
      data={currentList}
      renderItem={({ item }) => <MerchantCard cardData={item} style={{ marginVertical: 8, width: Metrics.screenWidth / 2 - 24 }} />}
      numColumns={2}
      keyExtractor={(item, index) => `${item.title}_${index}`}
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
      contentContainerStyle={{
        paddingHorizontal: Metrics.newScreenHorizontalPadding,
        paddingTop: Metrics.screenHorizontalPadding,
        paddingBottom: Metrics.screenHorizontalPadding * 2,
      }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={() => <ListFooterComponent isPageLoading={isPageLoading} />}
      ListEmptyComponent={() => (
        <View style={{ flex: 1, backgroundColor: Colors.white, marginBottom: 100 }}>
          <NoPostTaxVendorsPlaceHolderSection />
        </View>
      )}
      maxToRenderPerBatch={15}
      initialNumToRender={5}
      onEndReachedThreshold={1}
      onEndReached={() => listOnEndReachedCallback()}
      removeClippedSubviews={false}
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
    />
  );
};

// state for the merchant listing
type defaultState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  emptyScreenLoader: boolean;
};
const defaultState: defaultState = {
  totalPages: -1,
  currentPage: 0,
  currentList: [],
  isPageLoading: false,
  emptyScreenLoader: true,
};

// reducer for the reimbursement list actions
const reducer = (state: defaultState, action) => {
  switch (action.type) {
    case "RESET_STATE":
      return defaultState;
    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        currentPage: inc(state.currentPage),
        isPageLoading: true,
      };
    case "SET_MERCHANT_LIST":
      return {
        ...state,
        currentList: action.currentList,
        isPageLoading: false,
      };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.totalPages };
    case "TOGGLE_PAGINATION_LOADER":
      return { ...state, isPageLoading: action.isPageLoading };
    case "TOGGLE_EMPTY_SCREEN_LOADER":
      return { ...state, emptyScreenLoader: action.emptyScreenLoader };
    default:
      return state;
  }
};

const HomeScreenWalletListingScreen = (props) => {
  const wallets: Array<WalletCardProps> = useSelector((state) => pathOr([], ["userProfile", "userInfo", "wallets"], state));
  const userCountry: string = useSelector((state) => pathOr("", ["userProfile", "userInfo", "country"], state));
  const screenLoader = useSelector((state) => pathOr(false, ["appScreenLoader", "isLoading"], state));
  const currencyCode = findCountryCurrencyCode(userCountry);

  const actionsDispatch = useDispatch();
  const { MarketPlaceState } = useMarketplaceVendorsContext();
  const { selectedWallet } = MarketPlaceState;
  const name = propOr("", "name", selectedWallet);
  const walletId = propOr("", "walletId", selectedWallet);

  const [state, dispatch] = React.useReducer(reducer, defaultState);
  // state for the merchant listing
  const { currentPage, currentList, totalPages, isPageLoading } = state;

  type getVendorsType = {
    currentPage: number;
    currentList: Array<object>;
  };

  const getVendorsList = async (state?: getVendorsType) => {
    const { currentPage = 0, currentList = [] } = state || {};

    const isInitialPage = currentPage === 0;
    const VendorsData = (await fetchVendorListingsByWallet(wallets, walletId, userCountry, currentPage)) || [];
    // This check is applicable when algolia returns empty data to dismiss loader
    // Also, this is applied before destructing from VendorsData[0] because totalPages and data get undefined
    if (VendorsData.length === 0) {
      await actionsDispatch(toggleAppScreenLoader(false));
    }
    const { data = [], totalPages = -1 } = VendorsData[0];
    // set the total pages on initial page
    if (isInitialPage) {
      dispatch({
        type: "SET_TOTAL_PAGES",
        totalPages: totalPages,
        currentPage: currentPage + 1,
      });
      //T his check is applicable when algolia returns data to dismiss loader
      actionsDispatch(toggleAppScreenLoader(false));
    }

    const newList = data.map((vendor) => {
      return {
        ...vendor,
        displayAsAmount: true,
        priceUnit: currencyCode,
        isPointsAllowed: true,
      };
    });

    dispatch({
      type: "SET_MERCHANT_LIST",
      currentList: [...currentList, ...newList],
    });
  };

  React.useEffect(() => {
    getVendorsList({ currentList, currentPage });
    actionsDispatch(
      AmplitudeAnalytics.storeView({
        account_filter: name,
        category_filter: "",
      }),
    );
  }, []);

  // React.useEffect(() => {
  //   dispatch({ type: "RESET_STATE", isPageLoading: false });
  //   getVendorsList({ currentList: [], currentPage: 0 });
  // }, [name]);

  //For pagination
  React.useEffect(() => {
    if (currentPage === totalPages && isPageLoading) dispatch({ type: "TOGGLE_PAGINATION_LOADER", isPageLoading: false });
    if (currentPage > 0 && currentPage < totalPages) {
      getVendorsList({ currentList, currentPage });
    }
  }, [currentPage]);

  //when scroll reached to end and function is triggered
  const listOnEndReachedCallback = React.useCallback(() => {
    const { currentPage, totalPages, isPageLoading } = state;
    if (!isPageLoading && currentPage < totalPages) {
      dispatch({ type: "LOAD_NEXT_PAGE" });
    }
  }, [state]);

  return (
    <View style={{ backgroundColor: Colors.white }}>
      <MarketplaceAndMerchantListingHeader title={name} walletDetails={selectedWallet} showShadow />
      {/* when current list is not empty after screen loading */}
      <If condition={!screenLoader && currentList.length > 0}>
        <WalletListingContent actionsDispatch={actionsDispatch} listOnEndReachedCallback={listOnEndReachedCallback} currentList={currentList} isPageLoading={isPageLoading} getVendorsList={getVendorsList} currentPage={currentPage} />
      </If>
      {/* when current list is empty after screen loading */}
      <If condition={!screenLoader && currentList.length === 0}>
        <WalletListingContent actionsDispatch={actionsDispatch} listOnEndReachedCallback={() => {}} currentList={[]} isPageLoading={false} getVendorsList={getVendorsList} currentPage={currentPage} />
      </If>
      <MarketplaceFilterDrawer />
    </View>
  );
};

export default HomeScreenWalletListingScreen;
