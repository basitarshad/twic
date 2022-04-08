import { pathOr, propOr } from "ramda";

import ACTION_TYPES from "./action.types";
import { toggleAppScreenLoader } from "./appLoader.actions";

import { MerchantInfoProps, CategoryDetails } from "types";
import { VendorsApiHandlers, ChallengesApiHandlers, ChallengesHelpers } from "Services";
import { AppNotification } from "Components";
import { isEmptyOrNil } from "Utils";
import { fetchCategoriesHavingVendors, fetchVendorListingsByWallets } from "Services/API/marketplaceVendors.api";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";

const setVendors = (vendorsList: Array<MerchantInfoProps>) => {
  return {
    type: ACTION_TYPES.MARKETPLACE_ACTIONS.SET_VENDORS,
    payload: { vendorsList },
  };
};

export const getVendorById = ({ id }, bySubscriptionId = false) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const vendorResponse = await (!bySubscriptionId ? VendorsApiHandlers.fetchVendorById({ id }) : VendorsApiHandlers.fetchVendorBySubscriptionId({ id }));

    if (!vendorResponse.error) {
      const vendor = pathOr([], !bySubscriptionId ? ["data", "data", "vendor"] : ["data", "data", "subscription", "vendor"], vendorResponse);
      dispatch(toggleAppScreenLoader(false));
      return vendor;
    } else {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: "Unable to find vendor details.",
      });
      dispatch(toggleAppScreenLoader(false));
      return {};
    }
  };
};

export const getVendorByTransactionId = ({ id }) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const vendorResponse = await VendorsApiHandlers.fetchVendorByTransactionId({ id });

    if (!vendorResponse.error) {
      const transaction = pathOr([], ["data", "data", "transaction"], vendorResponse);
      dispatch(toggleAppScreenLoader(false));
      return transaction;
    } else {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: "Unable to find vendor details.",
      });
      dispatch(toggleAppScreenLoader(false));
      return {};
    }
  };
};

export const getChallengesData = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(toggleAppScreenLoader(true));
      const promises = [ChallengesApiHandlers.fetchChallengesList(), ChallengesApiHandlers.fetchApplicableActivitiesForChallenges()];

      Promise.all(promises).then((res) => {
        const vendorsResponse = pathOr([], ["0", "data", "data", "vendors"], res);
        const runningChallengesResponse = pathOr([], ["1", "data", "data", "challenges"], res);
        const applicableActivitiesResponse = pathOr([], ["2", "data", "data", "applicable_activity_types"], res);

        const applicableActivities = ChallengesHelpers.formatApplicableActivitiesForChallenges(applicableActivitiesResponse);
        const challengesList = ChallengesHelpers.formattedChallengesList({
          challenges: runningChallengesResponse,
          keysToInclude: [],
          applicableActivities,
        });
        dispatch(setVendors(vendorsResponse));
        dispatch({
          type: ACTION_TYPES.CHALLENGES_ACTIONS.SET_CHALLENGES_DATA,
          payload: {
            challengesList,
            applicableActivities,
          },
        });
        dispatch(toggleAppScreenLoader(false));
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchRunningChallenges = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { challengesData } = state;

    const response = await ChallengesApiHandlers.fetchChallengesList();
    const runningChallengesResponse = pathOr([], ["data", "data", "challenges"], response);

    const challengesList = ChallengesHelpers.formattedChallengesList({
      challenges: runningChallengesResponse,
      keysToInclude: [],
      applicableActivities: propOr([], "applicableActivities", challengesData),
    });

    dispatch({
      type: ACTION_TYPES.CHALLENGES_ACTIONS.SET_CHALLENGES_DATA,
      payload: { challengesList },
    });
  };
};

export const getStoreVendorSections = (MarketPlaceDispatcher) => {
  return async (dispatch, getState) => {
    const state = getState();
    const wallets = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const userCountry = pathOr("", ["userProfile", "userInfo", "country"], state);
    dispatch(toggleAppScreenLoader(true));
    if (!isEmptyOrNil(wallets)) {
      const fetchWalletsAndVendors = async () => {
        await fetchVendorListingsByWallets(wallets, MarketPlaceDispatcher, userCountry, {
          shouldComponentUpdate: false,
        });
        dispatch(
          AmplitudeAnalytics.storeView({
            account_filter: "Store",
            category_filter: "",
          }),
        );
      };
      await fetchWalletsAndVendors();
    }
    dispatch(toggleAppScreenLoader(false));
    await fetchCategoriesHavingVendors(wallets, MarketPlaceDispatcher, userCountry);
  };
};
