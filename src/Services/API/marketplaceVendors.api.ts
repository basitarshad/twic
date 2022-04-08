import algoliaSearch from "algoliasearch";
import { useDispatch } from "react-redux";
import { pathOr } from "ramda";
import Store from "../../Redux/store";
import { isEmptyOrNil } from "Utils";
import {
  getFormattedSubCategories,
  getFormattedSubCategoriesQuery,
  getFormattedBlackListedVendorsQuery,
  getFormattedCommonQuery,
  getFormattedVendors,
  getAllWalletsFormattedSubCategories,
  geCategoriesHavingVendors,
  getAllWalletsOutOfPocketQuery,
  getNoOutOfPocketFilter,
} from "Services/MarketplaceVendors";
import { CategoryDetails, MarketplaceVendorType, WalletCardProps } from "../../types";
import { toggleAppScreenLoader } from "Actions";

//testing
export const APPLICATION_ID = "Y5XPHR9LYY";
export const SEARCH_API_KEY = "9e5d0d653b284eaf6c8cb19bd8150552";

//production
// export const APPLICATION_ID = "BGPLGLPAWM";
// export const SEARCH_API_KEY = "d2715bb2a2537fffe25a0ea0f5464820";

const VENDOR_LIST_INDEX = "vendors_list_v1";
// const client = algoliaSearch(APPLICATION_ID, SEARCH_API_KEY, {responsesCache: createNullCache(),requestsCache: createNullCache()});
const client = algoliaSearch(APPLICATION_ID, SEARCH_API_KEY);

type WalletType = {
  categories: Array<any>;
} & WalletCardProps;

type VendorsFiltersConfigType = {
  label: string;
  dataKey: string;
};

type AlgoliaQueryType = {
  indexName: string;
  query: string;
  params: {
    hitsPerPage: number;
    filters: string;
    page?: number;
  };
  facets?: Array<string>;
  attributesToRetrieve?: Array<string>;
};

const VendorsFiltersConfig: Array<VendorsFiltersConfigType> = [
  {
    label: "Is New",
    dataKey: "isNew",
  },
  {
    label: "Forma Pick",
    dataKey: "twicPick",
  },
  {
    label: "No Cost To You",
    dataKey: "noCostToYou",
  },
  {
    label: "Popular On Forma",
    dataKey: "popularOnTwic",
  },
];

export type HomeSectionListType = {
  label?: string;
  dataKey?: string;
  totalPages?: number;
  currentPage?: number;
  data: Array<MarketplaceVendorType>;
};

const fetchVendors = async (queries, hasSections) => {
  const store = Store.getState();
  const countryExchangeRate = pathOr(1, ["userProfile", "userInfo", "countryExchangeRate"], store);

  try {
    const searchResults = await client.multipleQueries(queries);
    if (!isEmptyOrNil(searchResults.results)) {
      const formattedVendors: Array<HomeSectionListType> = searchResults.results.reduce((acc: any, filter: any, index: number) => {
        if (isEmptyOrNil(filter.hits)) return acc;
        const { page, nbPages, hits, facets } = filter;
        if (!isEmptyOrNil(facets)) {
          return facets.subcategories;
        }
        const vendors = getFormattedVendors(hits, countryExchangeRate);
        return hasSections
          ? [
              ...acc,
              {
                data: vendors,
                totalPages: nbPages,
                ...VendorsFiltersConfig[index],
              },
            ]
          : [
              {
                data: vendors,
                currentPage: page,
                totalPages: nbPages,
              },
            ];
      }, []);
      return formattedVendors;
    }
  } catch (error) {
    const dispatch = useDispatch();
    console.log("error", error);
    dispatch(toggleAppScreenLoader(false));
    // return [];
  }
};

export const fetchVendorListingsByWallets = async (
  wallets: Array<WalletType>,
  dispatcher: any,
  userCountry: string,
  updateFlags: {
    shouldComponentUpdate: boolean;
  },
) => {
  //hasSections variable is used ro display sections on home screen
  const hasSections = true;
  const walletsSubCategories = getAllWalletsFormattedSubCategories(wallets);
  const walletsSubCategoriesQuery = getFormattedSubCategoriesQuery(walletsSubCategories);
  const blackListedVendorsQuery = getFormattedBlackListedVendorsQuery({ wallets, wallet: {} });
  const commonQuery = getFormattedCommonQuery(blackListedVendorsQuery, walletsSubCategoriesQuery, userCountry);
  const amount = getNoOutOfPocketFilter(wallets);
  //TODO: this code is commented for NO OUT OF POCKET Query
  // const outOfPocketSubCategoriesQuery = getAllWalletsOutOfPocketQuery(wallets)
  // const outOfPocketCommonQuery = getFormattedCommonQuery(blackListedVendorsQuery, outOfPocketSubCategoriesQuery, userCountry)
  const queries: Array<AlgoliaQueryType> = [
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 6,
        filters: `is_new:true AND ${commonQuery}`,
      },
    },
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 6,
        filters: `is_featured:true AND ${commonQuery}`,
      },
    },
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 6,
        filters: `usd_msrp <= ${amount} AND ${commonQuery}`,
      },
    },
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 6,
        filters: `num_of_purchase > 10 AND ${commonQuery}`,
      },
    },
  ];
  const formattedVendors = await fetchVendors(queries, hasSections);
  dispatcher({
    type: "UPDATE_MARKETPLACE_CONTEXT",
    payload: {
      vendors: formattedVendors,
      homeScreenLoading: false,
      ...updateFlags,
    },
  });
};

export const fetchVendorListingsByWallet = async (wallets: Array<WalletType>, walletId: string, userCountry: string, currentPage: number) => {
  //hasSections variable is used ro display sections on home screen
  const hasSections = false;
  //filtering on wallet name because walletTypeId is same for custom wallets
  const wallet = wallets.find((wallet) => wallet.walletId === walletId);
  const walletsSubCategories = !isEmptyOrNil(wallet) ? getFormattedSubCategories(wallet, "") : [];
  const walletsSubCategoriesQuery = getFormattedSubCategoriesQuery(walletsSubCategories);
  const blackListedVendorsQuery = getFormattedBlackListedVendorsQuery({ wallets, wallet });
  const commonQuery = getFormattedCommonQuery(blackListedVendorsQuery, walletsSubCategoriesQuery, userCountry);
  const queries: Array<AlgoliaQueryType> = [
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 10,
        page: currentPage,
        filters: `${commonQuery}`,
      },
    },
  ];
  const formattedVendors = await fetchVendors(queries, hasSections);
  return formattedVendors;
};

export const fetchCategoriesHavingVendors = async (wallets: Array<WalletType>, dispatcher: any, userCountry: string) => {
  const walletsSubCategories = getAllWalletsFormattedSubCategories(wallets);
  const walletsSubCategoriesQuery = getFormattedSubCategoriesQuery(walletsSubCategories);
  const blackListedVendorsQuery = getFormattedBlackListedVendorsQuery({ wallets, wallet: {} });
  const commonQuery = getFormattedCommonQuery(blackListedVendorsQuery, walletsSubCategoriesQuery, userCountry);
  const queries: Array<AlgoliaQueryType> = [
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      facets: ["subcategories"],
      attributesToRetrieve: ["id"],
      params: {
        hitsPerPage: 1,
        filters: `${commonQuery}`,
      },
    },
  ];
  const categoriesWithVendors = await fetchVendors(queries, false);
  const categories = await geCategoriesHavingVendors(categoriesWithVendors, wallets);

  dispatcher({
    type: "UPDATE_MARKETPLACE_CONTEXT",
    payload: {
      categoriesFilterList: categories.sort((a, b) =>
        !isEmptyOrNil(a.categoryAlias) && !isEmptyOrNil(b.categoryAlias) ? (a.categoryAlias.toLowerCase() > b.categoryAlias.toLowerCase() ? 1 : -1) : a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
      ),
    },
  });
};

export const fetchVendorListingsByCategories = async ({ wallets, walletTypeId, category, currentPage, userCountry }) => {
  const hasSections = false;
  let selectedWallet = {};
  const walletsData = wallets.filter((wallet) => wallet.walletTypeId === walletTypeId);
  walletsData.map((wallet) => {
    if (!isEmptyOrNil(wallet.categories)) {
      const requiredWallet = wallet.categories.find((cat) => cat.id === category);
      if (!isEmptyOrNil(requiredWallet)) {
        selectedWallet = wallet;
      }
    }
  });

  const walletFormattedSubcategories = !isEmptyOrNil(selectedWallet) ? getFormattedSubCategories(selectedWallet, category) : [];
  const walletSubCategoriesQuery = getFormattedSubCategoriesQuery(walletFormattedSubcategories);
  const walletBlackListedVendors = getFormattedBlackListedVendorsQuery({ wallets, wallet: selectedWallet });
  const commonQuery = getFormattedCommonQuery(walletBlackListedVendors, walletSubCategoriesQuery, userCountry);
  const queries: Array<AlgoliaQueryType> = [
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 10,
        page: currentPage,
        filters: `${commonQuery}`,
      },
    },
  ];
  const formattedVendors = await fetchVendors(queries, hasSections);
  return formattedVendors;
};

export const fetchVendorListingsByFilter = async ({ currentPage, filter = "", wallets, userCountry }) => {
  const hasSections = false;
  //const wallet = wallets.find(wallet => wallet.walletTypeId === walletTypeId)
  const walletsSubCategories = getAllWalletsFormattedSubCategories(wallets);
  const walletsSubCategoriesQuery = getFormattedSubCategoriesQuery(walletsSubCategories);
  const blackListedVendorsQuery = getFormattedBlackListedVendorsQuery({ wallets, wallet: {} });
  const commonQuery = getFormattedCommonQuery(blackListedVendorsQuery, walletsSubCategoriesQuery, userCountry);
  const queries: Array<AlgoliaQueryType> = [
    {
      indexName: VENDOR_LIST_INDEX,
      query: "",
      params: {
        hitsPerPage: 10,
        page: currentPage,
        filters: `${filter} ${commonQuery}`,
      },
    },
  ];
  const formattedVendors = await fetchVendors(queries, hasSections);
  return formattedVendors;
};
