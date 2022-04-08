import { Amplitude, Identify } from "@amplitude/react-native";
import { pathOr } from "ramda";

// constants for the amplitude analytics
// PROD
// const API_KEY = "d197a35a72d3054898aec34e165c7d6f";
// DEV
const API_KEY = "3a0587c3bbcac08167c5c2fd5b25b760";

const REIMBURSEMENT_DETAIL_VIEWED = "Claim Details Viewed";
const REIMBURSEMENT_LISTING_VIEWED = "Claims List Viewed";
const REIMBURSEMENT_FORM_VIEWED = "New Claim Viewed";
const EXPENSE_FORM_VIEWED = "New Expense Viewed";
const NEW_REIMBURSEMENT_SUBMITTED = "New Claim Submitted";
const NEW_EXPENSE_SUBMITTED = "New Expense Submitted";
const PAYMENTS_VIEWED = "Payments Viewed";
const TWIC_CARDS_VIEWED = "Twic Card Viewed";
const STORE_VIEWED = "Store Viewed";
const STORE_FILTER_VIEWED = "Store Filter Viewed";
const STORE_FILTER_SELECTED = "Store Filter Selected";
const ACCOUNT_DETAILS_VIEWED = "Accounts Viewed";
const PRODUCT_DETAILS_VIEWED = "Merchant product viewed";
const PRODUCT_CHECKOUT_STARTED = "Checkout started";
const PRODUCT_CHECKOUT_ENDED = "Checkout completed";
const EXTERNAL_STORE_VIEWED = "External Store Viewed";

const amplitudeInstance = Amplitude.getInstance();

const initialize = () => {
  return (dispatch, getState) => {
    if (__DEV__) return;
    const userInfo: any = pathOr({}, ["userProfile", "userInfo"], getState());
    const { id, firstName, lastName, email, userLocation } = userInfo;
    const companyName = pathOr("", ["userProfile", "companyInfo", "name"], getState());
    amplitudeInstance.init(API_KEY);
    amplitudeInstance.setUserId(id);
    var identify = new Identify();
    //THESE 3 PROPERTIES WERE ALREADY LOGGED IN FOR USER PROPERTIES
    //SO WE HAD TO REMOVE THEM
    identify.unset("state");
    identify.unset("zip");
    identify.unset("street");
    // SET THESE VALUE WHEN APP INITIALIZES
    identify.set("first_name", firstName);
    identify.set("last_name", lastName);
    identify.set("email", email);
    identify.set("location", userLocation);
    identify.set("company", companyName);

    amplitudeInstance.identify(identify);
  };
};

const sendEventToAmplitude = (eventName: string, data?: any) => {
  if (__DEV__) return;
  // amplitudeInstance.logEvent(eventName, data);
};

// log event when reimbursement detail page is viewed
const logReimbursementDetailView = (reimbursementData: { status: string; amount: number; submit_date: string; account: string; reimbursement_plan: boolean }) => {
  return () => {
    const data = {
      ...reimbursementData,
    };
    // sendEventToAmplitude(REIMBURSEMENT_DETAIL_VIEWED, data);
  };
};

// log event when reimbursement listing page is viewed
const logReimbursementListingView = (count: number) => {
  return () => {
    const data = {
      count,
    };
    // sendEventToAmplitude(REIMBURSEMENT_LISTING_VIEWED, data);
  };
};

// log event when reimbursement form page is viewed
const newReimbursementFormView = () => {
  return () => {
    // sendEventToAmplitude(REIMBURSEMENT_FORM_VIEWED);
  };
};

// log event when expense form page is viewed
const newExpenseFormView = () => {
  return () => {
    // sendEventToAmplitude(EXPENSE_FORM_VIEWED);
  };
};

// log event when reimbursement is submitted
const newReimbursementSubmitted = (claim: { cost: number; transaction_date: string; vendor_name: string; account: string; category: string; is_recurring: boolean; type: string }) => {
  return () => {
    const data = {
      ...claim,
    };
    // sendEventToAmplitude(NEW_REIMBURSEMENT_SUBMITTED, data);
  };
};

// log event when expense is submitted
const newExpenseSubmitted = (claim: { cost: string; transaction_date: string; vendor_name: string; account: string; type: string }) => {
  return () => {
    const data = {
      ...claim,
    };
    // sendEventToAmplitude(NEW_EXPENSE_SUBMITTED, data);
  };
};

// log event when payments page is viewed
const paymentsView = () => {
  return () => {
    // sendEventToAmplitude(PAYMENTS_VIEWED);
  };
};

// log event when twic cards page is viewed
const twicCardsView = () => {
  return () => {
    // sendEventToAmplitude(TWIC_CARDS_VIEWED);
  };
};

// log event when store page is viewed
const storeView = (params: { account_filter: string; category_filter: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(STORE_VIEWED, data);
  };
};

// log event when filter icon is clicked on home page
const storeFilterView = () => {
  return () => {
    // sendEventToAmplitude(STORE_FILTER_VIEWED);
  };
};

// log event when store filter is selected
const storeFilterSelected = (params: { account: string; category: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(STORE_FILTER_SELECTED, data);
  };
};

// log event when account detail page is viewed
const accountDetailView = (params: { account_name: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(ACCOUNT_DETAILS_VIEWED, data);
  };
};

// log event when product detail page is viewed
const productDetailView = (params: { price: number | string; categories: Array<string>; product_id: string; vendor_id: string; name: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(PRODUCT_DETAILS_VIEWED, data);
  };
};

// log event when product checkout process is started
const productCheckoutStarted = (params: { price: number | string; product_id: string; name: string; categories: Array<string>; vendor_id: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(PRODUCT_CHECKOUT_STARTED, data);
  };
};

// log event when product checkout process is completed
const productCheckoutEnded = (params: { price: number | string; product_id: string; name: string; categories: Array<string>; vendor_id: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(PRODUCT_CHECKOUT_ENDED, data);
  };
};

// log event when external store link viewed
const externalStoreViewed = (params: { store_name: string }) => {
  return () => {
    const data = {
      ...params,
    };
    // sendEventToAmplitude(EXTERNAL_STORE_VIEWED, data);
  };
};

export default {
  initialize,
  logReimbursementDetailView,
  logReimbursementListingView,
  newReimbursementFormView,
  newExpenseFormView,
  newReimbursementSubmitted,
  newExpenseSubmitted,
  paymentsView,
  twicCardsView,
  storeView,
  storeFilterView,
  storeFilterSelected,
  accountDetailView,
  productDetailView,
  productCheckoutStarted,
  productCheckoutEnded,
  externalStoreViewed,
};
