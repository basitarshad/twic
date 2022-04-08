import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pathOr, inc, propOr } from "ramda";
import { View, FlatList, RefreshControl } from "react-native";
import { If } from "react-if";
import DeviceInfo from "react-native-device-info";

import { MerchantCard, ScreenContainer } from "Components/Commons";
import { Colors, Metrics } from "Themes";
import { fetchVendorListingsByFilter, fetchVendorListingsByCategories } from "Services/API/marketplaceVendors.api";
import { findCountryCurrencyCode } from "Utils/helpers";
import MarketplaceAndMerchantListingHeader from "Components/Commons/MarketplaceAndMerchantListingHeader";
import APP_CONSTANTS from "Constants/AppConstants";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";
import { ListFooterComponent } from "Components/Commons/SectionLists";

import { GymAndFitnessContextProvider } from "./Components/GymAndFitnessSection/GymAndFitnessContext";
import { MerchantCardListingContentProps } from "./types";
import { NoVendorsPlaceHolderSection } from "./Components/NoVendorsPlaceHolderSection";
import { GymAndFitnessActivityListing } from "./Components/GymAndFitnessSection/GymAndFitnessActivityListing";
import { GymAndFitnessSearchListing } from "./Components/GymAndFitnessSection/GymAndFitnessSearchListing";
import { GymAndFitnessSearchSection } from "./Components/GymAndFitnessSection/GymAndFitnessSearchSection";
import { MarketplaceFilterDrawer } from "./Components/MarketplaceFilters/MarketplaceFilterDrawer";
import { getNoOutOfPocketFilter } from "Services/MarketplaceVendors";
import { toggleAppScreenLoader } from "Actions";

const MerchantListingContent = (props: MerchantCardListingContentProps) => {
  const { currentList, actionsDispatch, currentPage, getVendorsList, listOnEndReachedCallback, isPageLoading, RenderHeader = () => <></> } = props;

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
        paddingBottom: Metrics.screenHorizontalPadding * 4,
      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => <RenderHeader />}
      ListFooterComponent={() => <ListFooterComponent isPageLoading={isPageLoading} />}
      maxToRenderPerBatch={15}
      initialNumToRender={5}
      onEndReachedThreshold={1}
      ListEmptyComponent={() => (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <NoVendorsPlaceHolderSection flex={5} />
        </View>
      )}
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

const getFilterQuery = (amount, sectionKey) => {
  switch (sectionKey) {
    case "isNew":
      return "is_new:true AND ";
    case "twicPick":
      return "is_featured:true AND ";
    case "noCostToYou":
      return `usd_msrp <= ${amount} AND `;
    case "popularOnTwic":
      return "num_of_purchase > 10 AND ";
  }
};

const MerchantAndCategoryListingScreen = (props) => {
  const { navigation, route } = props;
  const userProfile = useSelector((state) => propOr({}, "userProfile", state));
  const screenLoader = useSelector((state) => pathOr(false, ["appScreenLoader", "isLoading"], state));
  const wallets = pathOr([], ["userInfo", "wallets"], userProfile);
  const userCountry = pathOr("", ["userInfo", "country"], userProfile) as string;
  const isCountryUs = userCountry === "us";
  const currencyCode = findCountryCurrencyCode(userCountry);
  const params = route.params.params || {};
  const { categoryTitle = "", selectedCategory = "", walletTypeId = "", sectionKey = "", isFilter = false, backNavigation = true } = params;

  const isFitnessActivity = selectedCategory === "fitness_activities";
  const actionsDispatch = useDispatch();
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

    const noOutOfPocketFilterAmount = isFilter && (await getNoOutOfPocketFilter(wallets));
    const VendorsData = isFilter
      ? (await fetchVendorListingsByFilter({ currentPage, filter: getFilterQuery(noOutOfPocketFilterAmount, sectionKey), wallets, userCountry })) || []
      : (await fetchVendorListingsByCategories({ wallets, walletTypeId, category: selectedCategory, currentPage, userCountry })) || [];

    if (VendorsData.length === 0) {
      actionsDispatch(toggleAppScreenLoader(false));
    }

    const { data = [], totalPages = -1 } = VendorsData[0];
    // set the total pages on initial page
    if (isInitialPage) {
      dispatch({
        type: "SET_TOTAL_PAGES",
        totalPages: totalPages,
      });
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
    // LOG EVENT FOR AMPLITUDE
    actionsDispatch(
      AmplitudeAnalytics.storeView({
        account_filter: "",
        category_filter: categoryTitle,
      }),
    );
  }, []);

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

  const getPaddingForNotch = () => {
    const hasNotch = DeviceInfo.hasNotch();
    if (!APP_CONSTANTS.IS_ANDROID && hasNotch) return 0;
    else if (!APP_CONSTANTS.IS_ANDROID && !hasNotch) return Metrics.smallMargin;
    return 0;
  };

  const GymAndFitnessSection = () => {
    return (
      <If condition={isFitnessActivity && isCountryUs}>
        <GymAndFitnessSearchSection navigation={navigation} />
      </If>
    );
  };

  return (
    <ScreenContainer style={{ position: "relative" }}>
      <GymAndFitnessContextProvider>
        <If condition={isFitnessActivity && isCountryUs && !screenLoader}>
          <View style={{ position: "absolute", zIndex: 1, paddingTop: getPaddingForNotch(), backgroundColor: Colors.white }}>
            {/* Search Listing for the GymAndFitnessSection */}
            <GymAndFitnessSearchListing {...{ navigation }} />
            {/* Activities Listing for the GymAndFitnessSection */}
            <GymAndFitnessActivityListing {...{ navigation }} />
          </View>
        </If>

        {/* Content Sections */}
        <View style={{ zIndex: -1 }}>
          <MarketplaceAndMerchantListingHeader walletDetails={{}} showBackButton={backNavigation} showShadow title={categoryTitle} showFilterMenu={!backNavigation} />

          {/* Category Listing */}
          <If condition={!screenLoader && currentList.length > 0}>
            <MerchantListingContent
              actionsDispatch={actionsDispatch}
              RenderHeader={() => <GymAndFitnessSection />}
              listOnEndReachedCallback={listOnEndReachedCallback}
              currentList={currentList}
              isPageLoading={isPageLoading}
              getVendorsList={getVendorsList}
              currentPage={currentPage}
            />
          </If>
          <If condition={!screenLoader && currentList.length === 0}>
            <MerchantListingContent
              actionsDispatch={actionsDispatch}
              RenderHeader={() => <GymAndFitnessSection />}
              listOnEndReachedCallback={() => {}}
              currentList={[]}
              isPageLoading={false}
              getVendorsList={getVendorsList}
              currentPage={currentPage}
            />
          </If>
        </View>
        <MarketplaceFilterDrawer />
      </GymAndFitnessContextProvider>
    </ScreenContainer>
  );
};

export default MerchantAndCategoryListingScreen;
