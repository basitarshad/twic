import * as React from "react";
import { HomeSectionListType } from "Services/API/marketplaceVendors.api";
import { CategoryDetails, PretaxAccountsType } from "types";

export const UPDATE_MARKETPLACE_CONTEXT = "UPDATE_MARKETPLACE_CONTEXT";
export type pretaxFSAAccountsType = {
  title: string;
  amount: number | string;
  accounts: PretaxAccountsType[];
};
type SelectedWalletType = {
  walletTypeId: string;
  amount: string;
  name: string;
  key: string;
  walletId: string;
  fundsExpireDays: number;
  categories: Array<CategoryDetails>;
  isTwicCardPaymentAllowed: boolean;
};

type VendorStateType = {
  vendors: Array<HomeSectionListType>;
  selectedWallet: SelectedWalletType | undefined;
  shouldComponentUpdate: boolean;
  isDrawerOpen: boolean;
  categoryId: string;
  categoriesFilterList: Array<CategoryDetails>;
  homeScreenLoading: boolean;
  preTaxAccount: undefined | pretaxFSAAccountsType;
};

const defaultState = {
  vendors: [],
  selectedWallet: undefined,
  shouldComponentUpdate: true,
  isDrawerOpen: false,
  categoryId: "",
  categoriesFilterList: [],
  homeScreenLoading: true,
  preTaxAccount: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_MARKETPLACE_CONTEXT:
      return {
        ...state,
        ...action.payload,
      };
    case "TOGGLE_FILTER":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

interface ContextProviderType {
  MarketPlaceState: VendorStateType;
  MarketPlaceDispatcher: any;
}
// React Context for the Filters
const MarketplaceVendorsContext = React.createContext<ContextProviderType>({ MarketPlaceState: defaultState, MarketPlaceDispatcher: () => {} });

// React Hook to access MarketplaceVendorsContext
const useMarketplaceVendorsContext = () => React.useContext(MarketplaceVendorsContext);

// React context provider for the Filters
// this will contain the overall shared state for the filters
const MarketplaceVendorsContextProvider = (props) => {
  const [MarketPlaceState, MarketPlaceDispatcher] = React.useReducer(reducer, defaultState);

  const value = {
    MarketPlaceState,
    MarketPlaceDispatcher,
  };
  return <MarketplaceVendorsContext.Provider value={value}>{props.children}</MarketplaceVendorsContext.Provider>;
};

export { useMarketplaceVendorsContext, MarketplaceVendorsContextProvider };
