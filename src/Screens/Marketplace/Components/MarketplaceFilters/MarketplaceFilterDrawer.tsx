import * as React from "react";
// import { NavigationContext } from "react-navigation";

import { AppDrawer } from "Components/Commons";
import { useMarketplaceVendorsContext } from "Screens/Marketplace/MarketplaceVendorsContext";

import AccountsAndCategoriesFilters from "./FilterDrawerTemplates/AccountsAndCategoriesFilters";

export const MarketplaceFilterDrawer = () => {
  const { MarketPlaceState, MarketPlaceDispatcher } = useMarketplaceVendorsContext();
  const { isDrawerOpen = false } = MarketPlaceState || {};

  // const navigation = React.useContext(NavigationContext);

  const closeDrawer = () => {
    MarketPlaceDispatcher({
      type: "TOGGLE_FILTER",
      payload: { isDrawerOpen: false },
    });
  };

  return <AppDrawer isDrawerOpen={isDrawerOpen} onCloseHandler={closeDrawer} DrawerContent={() => <AccountsAndCategoriesFilters />} />;
};
