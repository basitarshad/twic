import { pathOr, pick, omit, head, prop, has, toUpper } from "ramda";
import propOr from "ramda/es/propOr";

import { toggleAppScreenLoader } from "./appLoader.actions";
import { CheckoutApiHelpers, NavigationService, TransactionsHelpers, TransactionsApiHandlers } from "Services";
import { getAmountToPoints, getPointsToAmount, isEmptyOrNil, injectTimeout } from "Utils";
import { AppNotification } from "Components";
import { FormSettings } from "Screens/Checkout/utils";
import { WalletCardProps } from "types";
import { AmplitudeAnalytics } from "AppAnalytics";
import transactions from "Services/transactions";

import { APP_ROUTES } from "../Navigation";
import { fetchUserProfile } from "./user.actions";

const { formFields: FORM_FIELDS } = FormSettings;

// fetches the sales tax for the current product
export const getSalesTaxInfo = ({ product, formValues, userCountry }) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const { userProfile } = getState();
    const { stipendConfig, userInfo } = userProfile;

    // use the form's selected state and zip if available
    // else use the default address values
    const { state = "", zip = "" } = !isEmptyOrNil(formValues) ? (pick(["state", "zip"], formValues) as { state: ""; zip: "" }) : pathOr({ state: "", zip: "" }, ["address"], userInfo);

    const salesTaxResponse = await CheckoutApiHelpers.getSalesTax({
      state,
      zip,
      country: toUpper(userCountry),
      amount: getPointsToAmount({ points: product.specialPrice, stipendConfig }),
    });
    dispatch(toggleAppScreenLoader(false));

    if (!salesTaxResponse.error) {
      const salesTaxData = pathOr({}, ["data", "data"], salesTaxResponse);
      //@ts-ignore
      const { amount_to_collect = 0 } = salesTaxData;
      return {
        salesTaxAmount: getAmountToPoints({ amount: amount_to_collect, stipendConfig }),
        salesTaxFound: true,
      };
    } else {
      AppNotification.toggleErrorNotification({
        message: "Unable to calculate Sales Tax",
        // description: pathOr('An unknown error occurred.', ['error', 'response', 'data', 'error', 'detail'], salesTaxResponse)
        description: "Please re-check the state and Zip code.",
      });
    }

    return {
      salesTaxAmount: 0,
      salesTaxFound: false,
    };
  };
};

// get location based pricing
export const getLocationBasedPricing = ({ product, location }) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const { userProfile } = getState();
    const { stipendConfig, userInfo } = userProfile;

    const dynamicLocationPricingResponse = await CheckoutApiHelpers.getDynamicLocationPricing({
      productId: product.productId,
      vendorId: product.vendorId,
      location,
    });
    dispatch(toggleAppScreenLoader(false));

    if (!dynamicLocationPricingResponse.error) {
      const locationBasedPrice = pathOr({}, ["data", "data"], dynamicLocationPricingResponse);
      //@ts-ignore
      const { total = 0 } = locationBasedPrice;

      return {
        // locationBasedPrice: getPointsToAmount({ amount: total, stipendConfig }),
        locationBasedPrice: total,
        priceFound: true,
      };
    }

    return {
      locationBasedPrice: 0,
      priceFound: false,
    };
  };
};

/**
 * generates a payload for the product checkout from the formValues and the checkout context
 *
 * @param {*} formValues
 * @param {*} checkoutContextData
 * @returns
 */
const generateStoreCheckoutPayload = (formValues, checkoutContextData) => {
  const { product, salesTaxAmount, userProfile } = checkoutContextData;
  const { stipendConfig } = userProfile;

  const checkoutRequiredFormValues = omit([FORM_FIELDS.purchasePolicyAccepted.fieldName, FORM_FIELDS.salesTaxFound.fieldName], formValues);

  const payload = {
    ...checkoutRequiredFormValues,
    ...(product.isSalesTaxRequired ? { sales_tax: getPointsToAmount({ points: salesTaxAmount, stipendConfig }) } : {}),
    ...(has("locality", formValues) ? { city: formValues.locality } : {}),

    pid: product.productId,
    vid: product.vendorId,
    type: "store",
  };
  return payload;
};

/**
 * After successful checkout, navigate to the required detail screen
 * product.isOneTimeProduct ? Transaction Details : Subscription Details
 *
 * Transaction/Subscription Title => vendorTitle: productTitle
 *
 * @param {*} { response, checkoutContextData, userWallets, vendorsList }
 */
const navigateToDetailsScreen = async ({ response, checkoutContextData, userWallets, vendorsList, dispatch }) => {
  const { product, userProfile } = checkoutContextData;
  const pathToResponse = product.isOneTimeProduct ? ["data", "data", "data"] : ["data", "data", "data", "subscription"];
  const data = pathOr({}, pathToResponse, response);
  const checkoutId = pathOr("", ["data", "data", "data", "id"], response);
  const routeParams = {
    details: {},
  };
  const { stipendConfig } = userProfile;

  // for one time checkout, fetch the transaction details, format them and then navigate to the transaction details
  // for subscription checkout, use the checkout API response to format details and then navigate to details screen
  if (product.isOneTimeProduct) {
    const transactionDetails = await TransactionsApiHandlers.getTransactionById(checkoutId);
    if (!transactionDetails.error) {
      const transaction = pathOr({}, ["data", "data", "transaction"], transactionDetails);
      const requiredData = {
        title: propOr(`${product.vendorId}: ${product.productId}`, "title", transaction),
        transaction,
        //@ts-ignore
        transaction_date: prop("created", transaction),
        //@ts-ignore
        created: prop("created", transaction),
      };
      const formattedDetails = head(TransactionsHelpers.getWalletTransactionDetails([requiredData], userWallets));
      routeParams.details = formattedDetails;
    }
  } else {
    const formattedDetails = head(TransactionsHelpers.getSubscriptionDetails([data], vendorsList));
    routeParams.details = {
      ...formattedDetails,
      name: `${product.vendorTitle}: ${product.productTitle}`,
      checkout: true,
    };
  }

  // navigate to the details screen with the required params
  dispatch(injectTimeout(2000));
  NavigationService.replaceScreen(product.isOneTimeProduct ? APP_ROUTES.USER_ORDER_DETAIL_SCREEN : APP_ROUTES.USER_SUBSCRIPTION_DETAIL_SCREEN, { params: routeParams });
};

/**
 * dispatches async calls to handle product checkout from the twic store
 *
 * @param {*} { formValues, checkoutContextData }
 * @returns
 */
export const checkoutProductFromTwicStore = ({ formValues, checkoutContextData, MarketPlaceDispatcher, product }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const vendorsList = pathOr([], ["marketplace", "vendorsList"], state);
    const userWallets: Array<WalletCardProps> = pathOr([], ["userProfile", "userInfo", "wallets"], state);
    const { productId, vendorTitle } = product;
    const productCategories = transactions.getProductCategories(product);
    dispatch(toggleAppScreenLoader(true));
    const data = generateStoreCheckoutPayload(formValues, checkoutContextData);
    const checkoutResponse = await CheckoutApiHelpers.sendCheckoutRequest({ data });

    if (!checkoutResponse.error) {
      AppNotification.toggleSuccessNotification({
        message: "Transaction Successful",
        description: "Transaction completed successfully!",
      });
      // LOG EVENT TO AMPLITUDE WHEN CHECKOUT IS DONE
      dispatch(
        AmplitudeAnalytics.productCheckoutEnded({
          price: product.specialPrice || "",
          product_id: productId || "",
          name: vendorTitle || "",
          categories: productCategories,
          vendor_id: product.vendorId || "",
        }),
      );
      await navigateToDetailsScreen({
        response: checkoutResponse,
        checkoutContextData,
        vendorsList,
        userWallets,
        dispatch,
      });
      //updating walllets amounts for accounts tab and home screen
      await dispatch(fetchUserProfile());

      MarketPlaceDispatcher({
        type: "UPDATE_MARKETPLACE_CONTEXT",
        payload: {
          shouldComponentUpdate: true,
        },
      });
    } else {
      AppNotification.toggleErrorNotification({
        message: "Transaction Failed",
        description: "This transaction failed. Please try again.",
      });
    }

    dispatch(toggleAppScreenLoader(false));
  };
};
