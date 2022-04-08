import * as React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { find, propEq, propOr, pathOr } from "ramda";
import { useSelector, useDispatch } from "react-redux";
import { If } from "react-if";

import { CardSection, ScreenContainer } from "Components/Commons";
import { findCountryCurrencyCode, isEmptyOrNil, formatPreTaxAccounts } from "Utils/helpers";
import { getStoreVendorSections } from "Actions/marketplace.actions";
import Metrics from "Themes/Metrics";
import MarketplaceAndMerchantListingHeader from "Components/Commons/MarketplaceAndMerchantListingHeader";

import { useMarketplaceVendorsContext } from "./MarketplaceVendorsContext";
import { MerchantInfoProps } from "../../types";
import { MarketplaceFilterDrawer } from "./Components/MarketplaceFilters/MarketplaceFilterDrawer";
import { HomeScreenEmptyVendorsContentView } from "./StyledComponents";
import { NoVendorsPlaceHolderSection } from "./Components/NoVendorsPlaceHolderSection";
import { NavigationService } from "Services";
import { APP_ROUTES } from "../../Navigation";
import { useAccountsHook } from "./useAccountsHook";
// define the render order for the sections
const ORDERED_SECTION_CATEGORIES = ["isNew", "twicPick", "noCostToYou", "popularOnTwic"];

/**
 * Renders the Marketplace Sections
 *
 * @param {*} sectionsList
 * @returns
 */
const renderHomeScreenSections = ({ sectionsList, MarketPlaceDispatcher, dispatch, redirectToPreTaxStoresListing, preTaxWallets }) => {
  if (isEmptyOrNil(sectionsList)) {
    return (
      <HomeScreenEmptyVendorsContentView>
        <NoVendorsPlaceHolderSection />
      </HomeScreenEmptyVendorsContentView>
    );
  }

  const renderItem = ({ item, index }) => {
    const section = find(propEq("key", item), sectionsList);
    if (isEmptyOrNil(section)) return null;
    const sectionCardsList: Array<MerchantInfoProps> = section.products;
    const sectionKey: string = propOr("", "key", section);
    const sectionTitle: string = propOr("", "description", section);
    const isSeeAllLinkEnabled: boolean = propOr(false, "showSeeAll", section);

    return (
      <If condition={!isEmptyOrNil(sectionCardsList)} key={index}>
        <CardSection sectionCardsList={sectionCardsList} sectionTitle={sectionTitle} sectionKey={sectionKey} isSeeAllLinkEnabled={isSeeAllLinkEnabled} />
      </If>
    );
  };

  const onRefresh = async () => {
    dispatch(getStoreVendorSections(MarketPlaceDispatcher));
    if (redirectToPreTaxStoresListing) {
      const formattedPreTaxAccounts = formatPreTaxAccounts(preTaxWallets);

      MarketPlaceDispatcher({
        type: "UPDATE_MARKETPLACE_CONTEXT",
        payload: {
          selectedWallet: {},
          categoryId: "",
          isDrawerOpen: false,
          preTaxAccount: formattedPreTaxAccounts[0],
        },
      });
    }
  };

  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingTop: Metrics.section }}
      data={ORDERED_SECTION_CATEGORIES}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={renderItem}
    />
  );
};

const HomeScreenContent = () => {
  const userCountry = useSelector((state) => pathOr([], ["userProfile", "userInfo", "country"], state));
  const { MarketPlaceState, MarketPlaceDispatcher } = useMarketplaceVendorsContext();
  const { homeScreenLoading } = MarketPlaceState;
  const dispatch = useDispatch();
  const currencyCode = findCountryCurrencyCode(userCountry);
  const { isFSAStoreEnabled, preTaxWallets, isPostTaxAccount } = useAccountsHook();
  const showMarketplace = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));

  const redirectToPreTaxStoresListing = isFSAStoreEnabled && (!isPostTaxAccount || !showMarketplace);

  if (homeScreenLoading && !isEmptyOrNil(MarketPlaceState.vendors.length)) return null;

  const sectionsList = MarketPlaceState.vendors.map((data) => {
    return {
      description: data.label,
      key: data.dataKey,
      showSeeAll: data.totalPages && data.totalPages > 1,
      products: data.data.map((p) => {
        return {
          ...p,
          displayAsAmount: true,
          priceUnit: currencyCode,
          isPointsAllowed: true,
        };
      }),
    };
  });

  return (
    <View style={{ paddingBottom: Metrics.doubleSection }}>
      {renderHomeScreenSections({
        sectionsList,
        MarketPlaceDispatcher,
        dispatch,
        redirectToPreTaxStoresListing,
        preTaxWallets,
      })}
    </View>
  );
};

//TODO:Commented code is for challenges as per CLIENT:Max suggestion
const HomeScreen = (props) => {
  // const { challenges = [],} = props;
  const dispatch = useDispatch();
  const { MarketPlaceDispatcher } = useMarketplaceVendorsContext();
  const showMarketplace = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));
  const { isFSAStoreEnabled, preTaxWallets, isPostTaxAccount } = useAccountsHook();

  const redirectToPreTaxStoresListing = isFSAStoreEnabled && (!isPostTaxAccount || !showMarketplace);
  React.useEffect(() => {
    dispatch(getStoreVendorSections(MarketPlaceDispatcher));
    if (redirectToPreTaxStoresListing) {
      const formattedPreTaxAccounts = formatPreTaxAccounts(preTaxWallets);

      MarketPlaceDispatcher({
        type: "UPDATE_MARKETPLACE_CONTEXT",
        payload: {
          selectedWallet: {},
          categoryId: "",
          isDrawerOpen: false,
          preTaxAccount: formattedPreTaxAccounts[0],
        },
      });
      setTimeout(() => {
        NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN_PRETAX_STORES_LISTING);
      }, 100);
    }
  }, []);

  // const RenderHeaderComponent = () => {
  //   /* Challenges Section */
  //   return (
  //     <If condition={!isEmptyOrNil(challenges)}>
  //       <ChallengesSection challengesList={challenges} userProfile={userProfile} />
  //     </If>
  //   );
  // };

  return (
    <ScreenContainer>
      {/* Enable Api call when tab changes every time */}
      {/* <NavigationEvents onWillFocus={getRunningChallenges} /> */}
      <MarketplaceAndMerchantListingHeader title={redirectToPreTaxStoresListing ? " " : "Store"} showShadow />
      {!redirectToPreTaxStoresListing && <HomeScreenContent />}
      <MarketplaceFilterDrawer />
    </ScreenContainer>
  );
};

export default HomeScreen;
